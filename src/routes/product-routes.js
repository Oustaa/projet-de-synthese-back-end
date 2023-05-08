const express = require("express");

const { checkTocken } = require("../middlewares/authentication");
const { createProduct } = require("../controllers/products-controller");

const router = express.Router();

// router.get("/");
router.post("/", checkTocken, createProduct);

module.exports = router;
