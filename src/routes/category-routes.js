const express = require("express");

const { verifyStoreToken } = require("../middlewares/verifyStoreToken");

const {
  getCategories,
  createCategory,
  createSubCategory,
} = require("../controllers/category-controller");

const router = express.Router();

router.get("/", getCategories);
router.post("/", verifyStoreToken, createCategory);
router.post("/:id", verifyStoreToken, createSubCategory);

module.exports = router;
