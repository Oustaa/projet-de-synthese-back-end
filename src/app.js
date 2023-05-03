require("dotenv").config();
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const storeRoutes = require("./routes/store-routes");
const authRoutes = require("./routes/auth-routes");

const app = express();

app.use((req, res, next) => {
  console.log(`URL: ${req.url}, Method: ${req.method}`);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api", express.static(path.join(__dirname, "..", "public")));

app.use("/api/stores", storeRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
