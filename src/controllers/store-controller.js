const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StoreModule = require("../models/store.model");
const ProductModule = require("../models/product.model");

const serverErrorHandler = require("../middlewares/error_handler");
const renameFolder = require("../utils/renameFolder");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// require auth as a store owner
async function getStore(req, res) {
  const id = req.store?.id;

  if (!id)
    return res
      .status(403)
      .json({ message: "you cant get the store, you must log in first." });

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
    serverErrorHandler(res, error);
  }
}

// user
async function getStoreById(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(204).json({ message: "Please provide a store id." });
  }

  try {
    const store = await StoreModule.findOne(
      { _id: id },
      {
        name: 1,
        bg_image: 1,
        avatar: 1,
        currency: 1,
        followers: 1,
      }
    );

    if (!store)
      return res
        .status(404)
        .json({ message: `There is no store with id ${id}.` });

    return res.status(200).json(store);
  } catch (error) {
    serverErrorHandler(res, error);
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
    serverErrorHandler(res, error);
  }
}

async function getStoreByFilters(req, res) {
  const { filter, limit } = req.body;

  const storeCount = await StoreModule.find(filter, {}).count();

  if (storeCount === limit) {
    return res.status(409).json({ conflect: true });
  } else {
    return res.status(200).json({ conflect: false });
  }
}

async function putStore(req, res) {
  const updateInfo = req.body;
  const id = req.store.id;

  if (updateInfo.password) {
    const hashPassword = await bcrypt.hash(updateInfo.password, 10);
    Object.assign(updateInfo, { password: JSON.stringify(hashPassword) });
  }

  if (!id)
    return res.status(403).json({
      message: "can't change store information unless you own it.",
    });

  const updatedStore = await StoreModule.updateOne(
    { _id: id },
    { ...updateInfo, updated_at: new Date() }
  );
  // renameFolder(req.store.name, updateInfo.name);

  return res.status(201).json({
    updatedStore,
  });
}

async function deleteStore(req, res) {
  const id = req.store.id;

  try {
    const deleteStoreCount = await StoreModule.deleteOne({ _id: id });
    if (deleteStoreCount.acknowledged && deleteStoreCount.deletedCount === 1) {
      const deleteProductsCount = await ProductModule.deleteMany({
        store_id: id,
      });
    }
    return res.status(201).json(deleteStoreCount);
  } catch (error) {
    console.log(error);
  }
}

async function postAnswer(req, res) {
  const qestionId = req.query.questionId;
  const productId = req.params.id;
  const storeid = req.store.id;

  const QandA = req.body;

  console.log(QandA, qestionId, productId, storeid);

  try {
    const { acknowledged, modifiedCount } = await ProductModule.updateOne(
      {
        _id: productId,
      },
      {
        $push: {
          QandA: { question: QandA.question, answer: QandA.answer },
        },
      }
    );

    if (acknowledged && modifiedCount) {
      const deleteQuestion = await StoreModule.updateOne(
        { _id: storeid },
        {
          $pull: {
            questions: { _id: { $in: [qestionId] } },
          },
        }
      );

      return res.json(deleteQuestion);
    } else {
      return res.json({ message: "answer was not inserted" });
    }
  } catch (error) {
    serverErrorHandler(res, error);
  }
}

module.exports = {
  getStore,
  createStore,
  getStoreById,
  putStore,
  getStoreByFilters,
  deleteStore,
  postAnswer,
};
