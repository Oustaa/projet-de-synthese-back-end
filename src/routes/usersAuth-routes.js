const express = require("express");

const { verifyStoreToken } = require("../middlewares/verifyStoreToken");

const {
  createUser,
  logIn,
  getStoreByFilters,
} = require("../controllers/user-controller");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", logIn);
router.post("/exists", getStoreByFilters);

module.exports = router;
