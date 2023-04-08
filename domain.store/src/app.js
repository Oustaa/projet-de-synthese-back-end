require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");

const storeRoutes = require("./routes/store-router");
const authRoutes = require("./routes/auth-router");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/domain.store/api/stores", storeRoutes);
app.use("/domain.store/api/auth", authRoutes);

module.exports = app;
