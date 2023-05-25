const express = require("express");

const { storeImage } = require("../services/uploadImage");

const {
  getStore,
  createStore,
  getStoreByFilters,
  getStoreById,
  putStore,
  deleteStore,
  postAnswer,
} = require("../controllers/store-controller");
const { verifyStoreToken } = require("../middlewares/verifyStoreToken");

const router = express.Router();

// getting store for store owner
router.get("/", verifyStoreToken, getStore);
// getting store for a user
router.get("/:id", getStoreById);
router.post("/exists", getStoreByFilters);
router.post("/", createStore);
router.put("/", verifyStoreToken, putStore);
router.delete("/", verifyStoreToken, deleteStore);
router.post("/upload/:type", verifyStoreToken, storeImage);
router.post("/answer/:id", verifyStoreToken, postAnswer);

module.exports = router;
