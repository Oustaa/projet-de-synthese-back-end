const express = require("express");
const { verifyUserToken } = require("../middlewares/verifyUserToken");

const {
  getCartsProducts,
  postCartProducts,
  getUserCartProducts,
  toggleProductQuantity,
  deleteProductFromCart,
  toggleProductSavedLater,
} = require("../controllers/cart-controller");

const router = express.Router();

router.post("/", getCartsProducts);
router.post("/products", verifyUserToken, postCartProducts);
router.get("/", verifyUserToken, getUserCartProducts);
router.put("/", verifyUserToken, toggleProductQuantity);
router.put("/savedForLater", verifyUserToken, toggleProductSavedLater);
router.delete("/:id", verifyUserToken, deleteProductFromCart);

module.exports = router;
