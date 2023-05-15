const express = require("express");

const { storeImage } = require("../services/uploadImage");

const {
  getStore,
  createStore,
  getStoreBy,
  getStoreById,
  putStore,
  deleteStore,
  postAnswer,
} = require("../controllers/store-controller");
const { checkTocken } = require("../middlewares/authentication");

const router = express.Router();

// getting store for store owner
router.get("/", checkTocken, getStore);
// getting store for a user
router.get("/:id", getStoreById);
router.post("/exists", getStoreBy);
router.post("/", createStore);
router.put("/", checkTocken, putStore);
router.delete("/", checkTocken, deleteStore);
router.post("/upload/:type", checkTocken, storeImage);
router.post("/answer/:id", checkTocken, postAnswer);

module.exports = router;
