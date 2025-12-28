const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      const token = header.startsWith("Bearer") ? header.split(" ")[1] : null;

      if (!token) {
        return res.authenticated("Invalid token or missing");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.auth = decoded;

      if (decoded.type === "doctor") {
        const user = await Doctor.findById(decoded.id);
        req.user = user;
      } else if (decoded.type === "patient") {
        const user = await Patient.findById(decoded.id);
        req.user = user;
      }

      if (!req.user) {
        return res.authenticated("Invalid user");
      }
      next();
    } catch (error) {
      return res.authenticated("Invalid or token expired");
    }
  },
  requireRole: (role) => async (req, res, next) => {
    if (!req.auth || req.auth.type !== role) {
      return res.forbidden("Access denied");
    }
    next();
  },
};
