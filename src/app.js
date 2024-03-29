require("dotenv").config();
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");

const storeRoutes = require("./routes/store-routes");
const storeAuthRoutes = require("./routes/storeAuth-routes");
const userAuthRoutes = require("./routes/usersAuth-routes");
const userRoutes = require("./routes/user-routes");
const categoryRoutes = require("./routes/category-routes");
const productRoutes = require("./routes/product-routes");
const cartRoutes = require("./routes/cart-routes");
const orderRoutes = require("./routes/order-routes");

const app = express();

app.use((req, res, next) => {
  console.log(
    `URL: ${req.url}, Method: ${req.method}, process ID: ${process.pid}`
  );
  next();
});

app.use(
  cors({
    origin: "*",
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
app.use("/api/auth/stores", storeAuthRoutes);
app.use("/api/auth/users", userAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
