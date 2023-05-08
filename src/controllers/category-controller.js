const CategoryModel = require("../models/category.model");

const serverErrorHandler = require("../middlewares/error_handler");

async function getCategories(req, res) {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json(categories);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function createCategory(req, res) {
  const categoryData = req.body;

  if (!categoryData.name)
    return res
      .status(404)
      .json({ message: `missing required field`, field: ["name"] });

  try {
    const category = await CategoryModel.create(categoryData);
    if (category) return res.status(200).json(category);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function createSubCategory(req, res) {
  const categoryId = req.params.id;
  const newSubCategory = req.body;

  if (!newSubCategory.name)
    return res
      .status(404)
      .json({ message: `missing required field`, field: ["name"] });

  try {
    const category = await CategoryModel.updateOne(
      { _id: categoryId },
      { $push: { subCategories: newSubCategory } }
    );
    if (category) return res.status(200).json(category);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = { getCategories, createCategory, createSubCategory };
