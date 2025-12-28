const express = require("express");
const validate = require("../middleware/validate");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const { body } = require("express-validator");
const passport = require("passport");

const router = express.Router();

const signToken = (id, type) => {
  jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.post(
  "/doctor/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
    try {
      const exists = await Doctor.findOne({ email: req.body.email });
      if (exists) {
        res.badRequest("Doctor already exists");
      }
      const hashed = await bcrypt.hash(req.body.password, 10);
      const doctor = await Doctor.create({
        ...req.body,
        password: hashed,
      });

      const token = signToken(doctor._id, "doctor");
      res.created(
        { token, user: { id: doctor, type: "doctor" } },
        "Doctor registered successfully"
      );
    } catch (error) {
      res.serverError("Doctor registration failed", [error.message]);
    }
  }
);

router.post(
  "/doctor/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ email: req.body.email });
      if (!doctor || !doctor.password) {
        res.unauthorized("Invalid credentials");
      }

      const match = await bcrypt.compare(req.body.password, doctor.password);
      if (!match) {
        res.unauthorized("Invalid credentials");
      }

      const token = signToken(doctor._id, "doctor");
      res.created(
        { token, user: { id: doctor, type: "doctor" } },
        "Doctor login successfully"
      );
    } catch (error) {
      res.serverError("Doctor Login failed", [error.message]);
    }
  }
);

router.post(
  "/patient/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
    try {
      const exists = await Patient.findOne({ email: req.body.email });
      if (exists) {
        res.badRequest("Patient already exists");
      }
      const hashed = await bcrypt.hash(req.body.password, 10);
      const patient = await Patient.create({
        ...req.body,
        password: hashed,
      });

      const token = signToken(patient._id, "patient");
      res.created(
        { token, user: { id: patient, type: "patient" } },
        "Patient registered successfully"
      );
    } catch (error) {
      res.serverError("Patient registration failed", [error.message]);
    }
  }
);

router.post(
  "/patient/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  async (req, res) => {
    try {
      const patient = await Patient.findOne({ email: req.body.email });
      if (!patient || !patient.password) {
        res.unauthorized("Invalid credentials");
      }

      const match = await bcrypt.compare(req.body.password, patient.password);
      if (!match) {
        res.unauthorized("Invalid credentials");
      }

      const token = signToken(patient._id, "patient");
      res.created(
        { token, user: { id: patient, type: "patient" } },
        "Patient login successfully"
      );
    } catch (error) {
      res.serverError("Patient Login failed", [error.message]);
    }
  }
);

// Google OAuth start from here

router.get("/google", (req, res, next) => {
  const userType = req.query.type || "patient";
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: userType,
    prompt: "select_account",
  })(req, res, next);
});

router.get(
  "/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  async (req, res) => {
    try {
      const { user, type } = req.user;
      const token = signToken(user._id, type);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = `${frontendUrl}/auth/success?token=${token}&type=${type}&user=${encodeURIComponent(
        JSON.stringify({
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        })
      )}`;

      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(
          error.message
        )}`
      );
    }
  }
);

router.get("/failure", (req, res) => {
  res.badRequest("Google authentication failed");
});

module.exports = router;
