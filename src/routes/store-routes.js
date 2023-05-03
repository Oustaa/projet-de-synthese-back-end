const express = require("express");

const { storeImage } = require("../services/uploadImage");

const {
  getStore,
  createStore,
  getStoreBy,
  getStoreById,
  putStore,
  deleteStore,
} = require("../controllers/store-controller");
const { checkTocken } = require("../middlewares/authentication");

const router = express.Router();

// getting store for store owner
router.get("/", checkTocken, getStore);
// getting store for a user
router.get("/:id", getStoreById);
router.post("/exists", getStoreBy);
router.post("/", checkTocken, createStore);
router.put("/", checkTocken, putStore);
router.delete("/", checkTocken, deleteStore);
router.post("/upload/:type", checkTocken, storeImage);

module.exports = router;
