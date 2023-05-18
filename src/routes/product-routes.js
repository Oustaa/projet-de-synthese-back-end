const express = require("express");

const { checkTocken } = require("../middlewares/authentication");
const { storeImage } = require("../middlewares/storeImage");
const {
  createProduct,
  getStoresProducts,
  deleteProduct,
  updatedProduct,
  getLatestProducts,
  postQuestion,
  getProductById,
  getSuggestionsByCategories,
} = require("../controllers/products-controller");

const router = express.Router();

router.get("/store", checkTocken, getStoresProducts);
router.get("/latest", getLatestProducts);
router.get("/:id", getProductById);
router.post("/suggestions/categories", getSuggestionsByCategories);
router.post("/", checkTocken, storeImage, createProduct);
router.post("/question/:id", checkTocken, postQuestion);
router.put("/:id", checkTocken, updatedProduct);
router.delete("/:id", checkTocken, deleteProduct);

module.exports = router;
