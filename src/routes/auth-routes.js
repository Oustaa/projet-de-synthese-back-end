const express = require("express");

const { login, isloggedin } = require("../controllers/auth-controller");

const router = express.Router();

router.post("/login", login);
router.get("/isloggedin", isloggedin);

module.exports = router;
