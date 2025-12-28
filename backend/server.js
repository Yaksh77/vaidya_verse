const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const response = require("../backend/middleware/response");
require("./config/passport");
const passportLib = require("passport");

const app = express();

// helmet is a security middleware for express
// It helps to secure your app by setting various HTTP headers
app.use(helmet());

// morgan is a logging middleware for express
// It logs requests to the console
app.use(morgan("dev"));
app.use(
  cors({
    origin:
      (process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) || "*",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(response);
app.use(passportLib.initialize());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/doctor", require("./routes/doctor"));
app.use("/api/patient", require("./routes/patient"));

const PORT = process.env.PORT || 8000;

// Mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/health", (req, res) => {
  res.ok({ time: Date.now().toLocaleString() }, "OK");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
