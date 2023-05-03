const express = require("express");

const { checkTocken } = require("../middlewares/authentication");

const {
  login,
  isloggedin,
  confirmPassword,
} = require("../controllers/auth-controller");

const router = express.Router();

router.post("/login", login);
router.get("/isloggedin", isloggedin);
router.post("/confirm/pass", checkTocken, confirmPassword);

module.exports = router;
