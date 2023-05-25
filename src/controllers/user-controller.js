const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const CartModel = require("../models/cart.model");
const serverErrorHandler = require("../middlewares/error_handler");

async function getStoreByFilters(req, res) {
  const { filter, limit } = req.body;

  try {
    const storeCount = await UserModel.find(filter).count();

    if (storeCount === limit) {
      return res.status(409).json({ conflect: true });
    } else {
      return res.status(200).json({ conflect: false });
    }
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function createUser(req, res) {
  const userInfo = req.body;

  try {
    const password = await bcrypt.hash(userInfo.password, 10);
    const createdUser = await UserModel.create({ ...userInfo, password });

    await CartModel.create({ user: createdUser._id });

    const token = await jwt.sign(
      { _id: createdUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30min" }
    );

    return res.status(201).json({ token, usename: createdUser.username });
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

async function logIn(req, res) {
  try {
    const user = await UserModel.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (!user)
      return res.status(400).json({
        message: "Invalid Credentials",
        password: true,
        email: false,
      });

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
        email: true,
        password: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30min",
    });

    return res.status(200).json({ token });
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = { getStoreByFilters, createUser, logIn };
