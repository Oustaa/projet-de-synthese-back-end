const ProductsModel = require("../models/product.model");
const serverErrorHandler = require("../middlewares/error_handler");

// projection for getting multiple products
const projection = {
  store_id: 1,
  title: 1,
  price: 1,
  currency: 1,
  images: 1,
  // category_id: 1,
  // subcategory_id: 1,
};

// get products by store id
async function getProductsByStoreId(req, res) {
  const storeID = req.params.id;

  if (!storeID)
    return res.status(204).json({
      massage: "please provide a store ID",
    });

  try {
    const products = await ProductsModel.findMany(
      { store_id: storeID },
      projection
    );

    // if (!products)
    //   return res
    //     .status(404)
    //     .json({ message: `There is no store with ID ${storeID}` });
    return res.status(200).json({ products });
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

// get store products fro store owner
async function getStoresProducts(req, res) {
  const storeID = req.store.id;

  if (!storeID) return res.status(403);

  try {
    const products = await ProductsModel.findMany({ store_id: storeID });

    if (!products)
      return res
        .status(404)
        .json({ message: `There is no store with ID ${storeID}` });
    return res.status(200).json({ products });
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

// get products by category
async function createProductsByCategory(req, res) {
  const category = req.params.category;

  if (!category)
    return res.status(404).json({ message: `please provide a category` });

  try {
    const products = await ProductsModel.findMany(
      { category_id: category },
      projection
    );

    return res.status(200).json(products);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

// get single product id
async function getProductById(req, res) {
  const productID = req.params.id;

  if (!productID)
    return res.status(404).json({ message: `please provide a product id` });

  try {
    const product = await ProductsModel.findOne(
      { _id: productID },
      { views: 0, visits: 0, available: 0 }
    );

    // increacing product visits by one
    product.visits = product.visits++;
    product.save();

    return res.status(200).json({ product });
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

// get products by search term
async function getproductsBysearch(rea, res) {}

// creating a product
async function createProduct(req, res) {
  const productsInfo = req.body;
  const store_id = req.store.id;
  // validate the producs info before creating
  if (
    !productsInfo.title ||
    !productsInfo.price ||
    !productsInfo.about ||
    !productsInfo.phone_number
  ) {
    // if it's not valid return a response with 400 status code and the none valid product info
    return res.status(404).json({
      message: `missing required field`,
      field: [
        !productsInfo.title && "title",
        !productsInfo.price && "price",
        !productsInfo.about && "about",
        !productsInfo.phone_number && "phone_number",
      ],
    });
  }
}

module.exports = {
  getProductsByStoreId,
  getStoresProducts,
  createProductsByCategory,
};
