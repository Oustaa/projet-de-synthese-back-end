const { Types } = require("mongoose");
const OrderModel = require("../models/order.model");
const ProductModel = require("../models/product.model");
const StoreModel = require("../models/store.model");
const serverErrorHandler = require("../middlewares/error_handler");

async function postOrder(req, res) {
  const user_id = req.user.id;
  const orderData = req.body;

  try {
    // Post order to the order collection
    const order = await OrderModel.create({ user_id, ...orderData });

    // Update the qte of the products in the store qte
    for (const element of order.items) {
      await ProductModel.updateOne(
        { _id: element.product, store_id: element.store },
        { $inc: { stock_Quantity: -element.qte } }
      );
    }

    return res.json(order);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function getOrdersByStore(req, res) {
  const storeId = req.store.id;

  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          "items.store": new Types.ObjectId(storeId),
        },
      },
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.store": new Types.ObjectId(storeId),
        },
      },
      {
        $group: {
          _id: "$_id",
          items: { $push: "$items" },
          user: { $first: "$user" },
          currency: { $first: "$currency" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    return res.json(orders);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function getOrdersByUser(req, res) {
  const userId = req.user.id;

  try {
    const orders = await OrderModel.find(
      { user_id: userId },
      {
        __v: 0,
      }
    );

    res.json(orders);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = { postOrder, getOrdersByStore, getOrdersByUser };
