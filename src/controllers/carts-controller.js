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
  stock_Quantity: 1,
};

async function getCartsProducts(req, res) {
  const { ids } = req.body;

  if (!ids)
    return res.status(404).json({ message: "Please provide a products IDs" });

  try {
    const aggregatedProduct = await ProductsModel.aggregate([
      {
        $match: {
          _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        },
      },
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

    return res.status(200).json(aggregatedProduct);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = {
  getCartsProducts,
};
