const express = require("express");
const validate = require("../middleware/validate");
const Doctor = require("../models/Doctor");
const { query, body } = require("express-validator");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/list",
  [
    query("search").optional().isString(),
    query("specialization").optional().isString(),
    query("city").optional().isString(),
    query("category").optional().isString(),
    query("minFees").optional().isInt({ min: 0 }),
    query("maxFees").optional().isInt({ min: 0 }),
    query("sortBy")
      .optional()
      .isIn(["fees", "experience", "name", "createdAt"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1 }),
  ],
  validate,
  async (req, res) => {
    try {
      const {
        search,
        specialization,
        category,
        city,
        minFees,
        maxFees,
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        limit = 20,
      } = req.query;

      const filter = { isVerified: true };

      if (specialization)
        filter.specialization = {
          $regex: `^${specialization}$`,
          $options: "i",
        };
      if (city) filter["hospitalInfo.city"] = { $regex: city, $options: "i" };
      if (category) {
        filter.category = category;
      }

      if (minFees || maxFees) {
        filter.fees = {};
        if (minFees) filter.fees.$gte = Number(minFees);
        if (maxFees) filter.fees.$lte = Number(maxFees);
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { specialization: { $regex: search, $options: "i" } },
          { "hospitalInfo.name": { $regex: search, $options: "i" } },
        ];
      }

      const sort = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      };
      const skip = (Number(page) - 1) * Number(limit);

      const [items, total] = await Promise.all([
        Doctor.find(filter)
          .select("-password -googleId")
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Doctor.countDocuments(filter),
      ]);

      res.ok(items, "Doctors fetched", {
        page: Number(page),
        limit: Number(limit),
        total,
      });
    } catch (error) {
      console.log("Doctor fetched failed", error);
      res.serverError("Doctor fetched failed", [error.message]);
    }
  }
);

router.get(
  "/me",
  authenticate,
  requireRole("doctor", async (req, res) => {
    const doctor = await Doctor.findById(req.user._id).select(
      "-password -googleId"
    );
    res.ok(doctor, "Profile fetched");
  })
);

router.put(
  "/onboarding/update",
  authenticate,
  requireRole("doctor"),
  [
    body("name").optional().notEmpty(),
    body("specialization").optional().notEmpty(),
    body("qualification").optional().notEmpty(),
    body("category").optional().isString(),
    body("experience").optional().isInt({ min: 0 }),
    body("about").optional().isString(),
    body("fees").optional().isInt({ min: 0 }),
    body("hospitalInfo").optional().isObject(),
    body("availibilityRange.startDate").optional().isISO8601(),
    body("availibilityRange.endDate").optional().isISO8601(),
    body("availibilityRange.excludedWeekdays").optional().isArray(),
    body("dailyTimeRange").isArray({ min: 1 }),
    body("dailyTimeRange.start").isString(),
    body("dailyTimeRange.end").isString(),
    body("slotDurationMinutes").optional().isInt({ min: 5, max: 180 }),
  ],
  validate,
  async (req, res) => {
    try {
      const updated = { ...req.body };
      delete updated.password;
      updated.isVerified = true;
      const doctor = await Doctor.findByIdAndUpdate(req.user._id, updated, {
        new: true,
      }).select("-password -googleId");

      res.ok(doctor, "Profile updated");
    } catch (error) {
      res.serverError("Update failed", [error.message]);
    }
  }
);

module.exports = router;
