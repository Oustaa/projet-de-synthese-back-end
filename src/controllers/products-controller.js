const ProductsModel = require("../models/product.model");
const StoreModule = require("../models/store.model");

const serverErrorHandler = require("../middlewares/error_handler");
const mongoose = require("mongoose");

// projection for getting multiple products
const projection = {
  store_id: 1,
  title: 1,
  price: 1,
  currency: 1,
  images: 1,
  categories_id: 1,
  subcategories_id: 1,
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

// get store products for store owner
async function getStoresProducts(req, res) {
  const storeID = req.store.id;

  if (!storeID) return res.status(403);

  try {
    const products = await ProductsModel.find({ store_id: storeID }).sort({
      inserted_at: -1,
    });

    if (!products)
      return res
        .status(404)
        .json({ message: `There is no store with ID ${storeID}` });
    return res.status(200).json(products);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

// get products by category
async function getProductsByCategory(req, res) {
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

async function getProductsBySubCategory(req, res) {
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

async function getLatestProducts(req, res) {
  const { limit } = req.query;
  try {
    const products = await ProductsModel.aggregate([
      { $sort: { inserted_at: -1 } },
      { $limit: limit || 4 },
      {
        $lookup: {
          from: "stores",
          localField: "store_id",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $project: {
          ...projection,
          store: {
            $arrayElemAt: ["$store.name", 0],
          },
        },
      },
    ]);

    return res.json(products);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function getSuggestionsByCategories(req, res) {
  const limit = req.query;

  try {
    // const suggestions = await ProductsModel.find(
    //   {
    //     $and: [
    //       {
    //         categories_id: {
    //           $in: req.body.categories_id,
    //         },
    //       },
    //       {
    //         subcategories_id: {
    //           $in: req.body.subcategories_id,
    //         },
    //       },
    //       { _id: { $ne: req.body.prodId } },
    //     ],
    //   },
    //   projection
    // ).limit(4);

    const suggestions = await ProductsModel.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: new mongoose.Types.ObjectId(req.body.prodId) } },
            {
              categories_id: {
                $in: req.body.categories_id,
              },
            },
            {
              subcategories_id: {
                $in: req.body.subcategories_id,
              },
            },
          ],
        },
      },
      { $limit: 4 },
      {
        $lookup: {
          from: "stores",
          localField: "store_id",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $project: {
          ...projection,
          store: {
            $arrayElemAt: ["$store.name", 0],
          },
        },
      },
    ]);

    res.json(suggestions);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

// get single product id
async function getProductById(req, res) {
  const productID = req.params.id;

  if (!productID)
    return res.status(404).json({ message: "Please provide a product ID" });

  try {
    const product = await ProductsModel.findOne(
      { _id: productID },
      { _v: 0 }
    ).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increment product visits by one
    // product.visits = product.visits + 1;
    // await product.save();

    // Perform the $lookup operation separately
    const aggregatedProduct = await ProductsModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(productID) } },
      {
        $lookup: {
          from: "stores",
          localField: "store_id",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $project: {
          store: {
            $arrayElemAt: ["$store.name", 0],
          },
        },
      },
    ]);

    return res
      .status(200)
      .json({ ...product, store: aggregatedProduct[0].store });
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

// get products by search term
async function getproductsBysearch(rea, res) {}

// creating a product
async function createProduct(req, res) {
  const productsInfo = req.body;

  const images = req.files.map((file) => file.filename);
  console.log(images);
  const store_id = req.store.id;

  // validate the producs info before creating
  if (!productsInfo.title || !productsInfo.price) {
    // if it's not valid return a response with 400 status code and the none valid product info
    return res.status(404).json({
      message: `missing required field`,
      field: [!productsInfo.title && "title", !productsInfo.price && "price"],
    });
  }

  try {
    const product = await ProductsModel.create({
      ...productsInfo,
      title: JSON.parse(productsInfo.title),
      description: productsInfo.description,
      specifications: productsInfo.specifications
        ? JSON.parse(productsInfo.specifications)
        : [],
      price: JSON.parse(productsInfo.price),
      available: Boolean(JSON.parse(productsInfo.stock_Quantity)),
      stock_Quantity: JSON.parse(productsInfo.stock_Quantity),
      about: productsInfo.about ? JSON.parse(productsInfo.about) : [],
      categories_id: JSON.parse(productsInfo.categories_id),
      subcategories_id: JSON.parse(productsInfo.subcategories_id),
      images,
      store_id,
    });

    if (product) return res.status(201).json(product);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  const storeId = req.store.id;

  try {
    const product = await ProductsModel.findById(id);

    if (product.store_id !== storeId)
      return res.json({ message: "Product not yours" });

    const deleteCount = await ProductsModel.deleteOne({ _id: id });

    return res.json(deleteCount);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function updatedProduct(req, res) {
  const id = req.params.id;
  const storeid = req.store.id;

  try {
    const product = await ProductsModel.findById(id);

    const updatedProduct = await ProductsModel.updateOne({ _id: id }, req.body);
    console.log(updatedProduct);
    return res.json(updatedProduct);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function postQuestion(req, res) {
  const productId = req.params.id;

  try {
    const product = await ProductsModel.findById(productId);

    const updateCount = await StoreModule.updateOne(
      { _id: product.store_id },
      {
        $push: { questions: { product_id: productId, text: req.body.text } },
      }
    );

    return res.json(updateCount);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = {
  getProductsByStoreId,
  getStoresProducts,
  getProductsByCategory,
  getSuggestionsByCategories,
  getLatestProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updatedProduct,
  postQuestion,
};
