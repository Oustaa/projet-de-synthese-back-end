const express = require("express");

const {
  getStore,
  createStore,
  getStoreBy,
  getStoreById,
  putStore,
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

module.exports = router;
