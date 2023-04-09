require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");

const storeRoutes = require("./routes/store-routes");
const authRoutes = require("./routes/auth-routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/domain.store/api/stores", storeRoutes);
app.use("/domain.store/api/auth", authRoutes);

module.exports = app;
