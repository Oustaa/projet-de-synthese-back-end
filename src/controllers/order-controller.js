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
        items: 1,
        total: 1,
        state: 1,
        createdAt: 1,
        "user.adress": 1,
      }
    );

    res.json(orders);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = { postOrder, getOrdersByStore, getOrdersByUser };
