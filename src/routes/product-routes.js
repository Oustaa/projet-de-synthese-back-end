const express = require("express");

const { checkTocken } = require("../middlewares/authentication");
const { storeImage } = require("../middlewares/storeImage");
const {
  createProduct,
  getStoresProducts,
} = require("../controllers/products-controller");

const router = express.Router();

router.get("/store", checkTocken, getStoresProducts);
router.post("/", checkTocken, storeImage, createProduct);

module.exports = router;
