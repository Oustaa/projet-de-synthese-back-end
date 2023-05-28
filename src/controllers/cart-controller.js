const ProductsModel = require("../models/product.model");
const CartModel = require("../models/cart.model");

const serverErrorHandler = require("../middlewares/error_handler");
const mongoose = require("mongoose");

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

async function postCartProducts(req, res) {
  const cart = req.body;
  const userId = req.user?.id;

  try {
    const usersCart = await CartModel.findOne({
      _id: new mongoose.Types.ObjectId("646faeacef5e619091b4534d"),
    }).lean();

    let { cartItems } = usersCart;

    const cartProductsIds = cartItems.map((elem) => elem.product.toString());
    console.log(cartItems);

    cart.forEach((item) => {
      if (cartProductsIds.includes(item.product)) {
        cartItems = cartItems.map((prod) => {
          if (prod.product.toString() == item.product.toString()) {
            return {
              ...prod,
              qte: prod.qte + item.qte,
              saveLater: item.saveLater,
            };
          }
          return prod;
        });
      } else {
        cartItems.push({ ...item, saveLater: false });
      }
    });

    const totalPrice = cartItems.reduce(
      (total, prod) => (prod.saveLater ? total : total + prod.price * prod.qte),
      0
    );

    const createdCart = await CartModel.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          cartItems: cartItems,
          totalPrice,
        },
      },
      { new: true }
    );

    return res.status(202).json(createdCart);
  } catch (error) {
    console.log(error);
    serverErrorHandler(res, error);
  }
}

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

async function getUserCartProducts(req, res) {
  const user = req.user;

  try {
    const cart = await CartModel.findOne({ user: user.id }).populate({
      path: "cartItems.product",
      select: "title price images currency store_id stock_Quantity",
    });

    res.status(200).json(cart);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function toggleProductQuantity(req, res) {
  const user = req.user.id;
  const product = req.body.product;
  const qte = req.body.qte;

  try {
    const cartItem = await CartModel.findOneAndUpdate(
      { user: user, "cartItems.product": product },
      {
        $inc: { "cartItems.$.qte": qte },
      },
      { new: true }
    );

    const totalPrice = cartItem.cartItems.reduce(
      (sum, item) => (!item.saveLater ? sum + item.price * item.qte : sum),
      0
    );

    cartItem.totalPrice = totalPrice;

    await cartItem.save();

    return res.status(202).json(cartItem);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function deleteProductFromCart(req, res) {
  const user = req.user.id;
  const product = req.params.id;

  try {
    const updatedCart = await CartModel.findOneAndUpdate(
      { user: user },
      { $pull: { cartItems: { product: product } } },
      { new: true }
    );

    const totalPrice = updatedCart.cartItems.reduce(
      (sum, item) => (!item.saveLater ? sum + item.price * item.qte : sum),
      0
    );

    updatedCart.totalPrice = totalPrice;

    await updatedCart.save();

    return res.status(202).json(updatedCart);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function toggleProductSavedLater(req, res) {
  const user = req.user.id;
  const product = req.body.product;
  const savedLater = req.body.savedLater;

  console.log(savedLater, product);

  try {
    const cartItem = await CartModel.findOneAndUpdate(
      { user: user, "cartItems.product": product },
      {
        $set: { "cartItems.$.saveLater": savedLater },
      },
      { new: true }
    );

    const totalPrice = cartItem.cartItems.reduce(
      (sum, item) => (!item.saveLater ? sum + item.price * item.qte : sum),
      0
    );

    cartItem.totalPrice = totalPrice;

    await cartItem.save();

    return res.status(202).json(cartItem);
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = {
  getCartsProducts,
  postCartProducts,
  getUserCartProducts,
  toggleProductQuantity,
  deleteProductFromCart,
  toggleProductSavedLater,
};
