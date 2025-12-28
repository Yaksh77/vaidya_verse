const express = require("express");
const validate = require("../middleware/validate");
const Patient = require("../models/Patient");
const { body } = require("express-validator");
const { authenticate, requireRole } = require("../middleware/auth");
const { computeAgeFromDob } = require("../utils/date");

const router = express.Router();

router.get(
  "/me",
  authenticate,
  requireRole("patient", async (req, res) => {
    const patient = await Patient.findById(req.user._id).select(
      "-password -googleId"
    );
    res.ok(doctor, "Profile fetched");
  })
);

router.put(
  "/onboarding/update",
  authenticate,
  requireRole("patient"),
  [
    body("name").optional().notEmpty(),
    body("phone").optional().isString(),
    body("dob").optional().isISO8601(),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("bloodGroup")
      .optional()
      .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

    body("emergencyContact").optional().isObject(),
    body("emergencyContact.name").optional().isString().notEmpty(),
    body("emergencyContact.phone").optional().isString().notEmpty(),
    body("emergencyContact.relationship").optional().isString().notEmpty(),

    body("medicalHistory").optional().isObject(),
    body("medicalHistory.allergies").optional().isString().notEmpty(),
    body("medicalHistory.currentMedications").optional().isString().notEmpty(),
    body("medicalHistory.chronicConditions").optional().isString().notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const updated = { ...req.body };
      if (updated.dob) {
        updated.age = computeAgeFromDob(updated.dob);
      }

      delete updated.password;
      updated.isVerified = true;
      const doctor = await Patient.findByIdAndUpdate(req.user._id, updated, {
        new: true,
      }).select("-password -googleId");

      res.ok(doctor, "Profile updated");
    } catch (error) {
      res.serverError("Update failed", [error.message]);
    }
  }
);

module.exports = router;
