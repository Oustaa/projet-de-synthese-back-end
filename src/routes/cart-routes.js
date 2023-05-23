const express = require("express");

const { getCartsProducts } = require("../controllers/carts-controller");

const router = express.Router();

router.post("/", getCartsProducts);

module.exports = router;
