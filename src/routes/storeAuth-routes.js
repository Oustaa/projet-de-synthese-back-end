const express = require("express");

const { verifyStoreToken } = require("../middlewares/verifyStoreToken");

const {
  login,
  isloggedin,
  confirmPassword,
} = require("../controllers/auth-controller");

const router = express.Router();

router.post("/login", login);
router.get("/isloggedin", isloggedin);
router.post("/confirm/pass", verifyStoreToken, confirmPassword);

module.exports = router;
