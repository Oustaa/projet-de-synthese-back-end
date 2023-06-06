const express = require("express");
const { verifyUserToken } = require("../middlewares/verifyUserToken");
const { verifyStoreToken } = require("../middlewares/verifyStoreToken");
const {
  postOrder,
  getOrdersByStore,
  getOrdersByUser,
} = require("../controllers/order-controller");

const router = express.Router();

router.get("/store", verifyStoreToken, getOrdersByStore);
router.get("/user", verifyUserToken, getOrdersByUser);
router.post("/", verifyUserToken, postOrder);

module.exports = router;
