const express = require("express");

const { checkTocken } = require("../middlewares/authentication");

const {
  getCategories,
  createCategory,
  createSubCategory,
} = require("../controllers/category-controller");

const router = express.Router();

router.get("/", getCategories);
router.post("/", checkTocken, createCategory);
router.post("/:id", checkTocken, createSubCategory);

module.exports = router;
