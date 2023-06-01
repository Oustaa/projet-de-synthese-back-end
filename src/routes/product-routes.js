const express = require("express");

const { verifyStoreToken } = require("../middlewares/verifyStoreToken");
const { verifyUserToken } = require("../middlewares/verifyUserToken");
const { storeImage } = require("../middlewares/storeImage");
const {
  getProductsByStoreId,
  createProduct,
  getStoresProducts,
  deleteProduct,
  updatedProduct,
  getProductsByCategory,
  getProductsBySubCategory,
  getproductsBySearch,
  getLatestProducts,
  postQuestion,
  getProductById,
  getSuggestionsByCategories,
  getProductsByIds,
  productViewed,
} = require("../controllers/products-controller");

const router = express.Router();

router.get("/store", verifyStoreToken, getStoresProducts);
router.get("/search", getproductsBySearch);
router.get("/store/:id", getProductsByStoreId);
router.get("/category/:category", getProductsByCategory);
router.get("/subCategory/:subCategory", getProductsBySubCategory);
router.get("/latest", getLatestProducts);
router.get("/:id", getProductById);
router.post("/ids", getProductsByIds);
router.post("/suggestions/categories", getSuggestionsByCategories);
router.post("/", verifyStoreToken, storeImage, createProduct);
router.post("/question/:id", verifyUserToken, postQuestion);
router.put("/:id", verifyStoreToken, updatedProduct);
router.put("/viewed/:id", productViewed);
router.delete("/:id", verifyStoreToken, deleteProduct);

module.exports = router;
