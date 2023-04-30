const express = require("express");

const {
  getStore,
  createStore,
  getStoreById,
} = require("../controllers/store-controller");
const { storeImage } = require("../middlewares/storeImage");
const router = express.Router();

// getting store for store owner
router.get("/", getStore);
// getting store for a user
router.get("/:id", getStoreById);
router.post("/", createStore);

module.exports = router;
