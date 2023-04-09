const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StoreModule = require("../models/store.model");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function getStore(req, res) {
  const id = req.store?.id || "6420be4f1a12583981fc6d6b";

  try {
    const store = await StoreModule.findById(id, { password: 0, __v: 0 });

    if (!store)
      return res.status(404).json({
        status: 404,
        error: true,
        message_error: `Store with id ${id} not found`,
      });

    return res.status(200).json({
      status: 200,
      items: store,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error,
      message_error: `internal server error, ${error.message}`,
      stack: error?.stack,
    });
  }
}

async function createStore(req, res, next) {
  const storeInfo = req.body;

  // validate the store info before creating
  if (
    !storeInfo.name ||
    !storeInfo.email ||
    !storeInfo.password ||
    !storeInfo.phone_number
  ) {
    // if it's not valid return a response with 400 status code and the none valid store info
    return res.status(404).json({
      message: `missing required field`,
      field: [
        !storeInfo.name && "name",
        !storeInfo.email && "email",
        !storeInfo.password && "password",
        !storeInfo.phone_number && "phone_number",
      ],
    });
  }

  try {
    // check if a store is already exists with the:
    // email
    const storeEmailCount = await StoreModule.findOne({
      email: storeInfo.email,
    });
    if (storeEmailCount) {
      return res.status(409).json({
        email: 1,
        message: `store with the email ${storeInfo.email} already exists, try logging in.`,
      });
    }

    // name
    const storeNameCount = await StoreModule.findOne({
      name: storeInfo.name,
    });
    if (storeNameCount) {
      return res.status(409).json({
        name: 1,
        message: `store with the name ${storeInfo.name} already exists, try changing the name.`,
      });
    }

    // one phone number can belong to only two stores at most
    const storePhoneCount = await StoreModule.find({
      phone_number: storeInfo.phone_number,
    }).count();
    if (storePhoneCount >= 2) {
      return res.status(409).json({
        phone_number: 2,
        message: `cant't create a store with the phone number ${storeInfo.phone_number}`,
      });
    }

    // hash password
    const hashPassword = await bcrypt.hash(storeInfo.password, 10);

    // if its ok then create the store and authanticat "send a token to the user"
    const store = await StoreModule.create({
      ...storeInfo,
      password: hashPassword,
    });

    const token = jwt.sign(
      { id: store._id, name: store.name },
      ACCESS_TOKEN_SECRET
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 43200000),
      secure: true,
      path: "http://localhost:3000/",
    });

    return res.status(200).json({ token, name: store.name });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error,
      message_error: `internal server error, ${error.message}`,
      stack: error?.stack,
    });
  }
}

module.exports = { getStore, createStore };
