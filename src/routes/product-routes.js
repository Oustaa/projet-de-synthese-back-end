const express = require("express");

const { checkTocken } = require("../middlewares/authentication");
const { storeImage } = require("../middlewares/storeImage");
const {
  createProduct,
  getStoresProducts,
  deleteProduct,
  updatedProduct,
  postQuestion,
} = require("../controllers/products-controller");

const router = express.Router();

router.get("/store", checkTocken, getStoresProducts);
router.post("/", checkTocken, storeImage, createProduct);
router.delete("/:id", checkTocken, deleteProduct);
router.put("/:id", checkTocken, updatedProduct);
router.post("/question/:id", checkTocken, postQuestion);

module.exports = router;
