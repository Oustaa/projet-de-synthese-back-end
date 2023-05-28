const express = require("express");

const { verifyUserToken } = require("../middlewares/verifyUserToken");

const { postVisits } = require("../controllers/user-controller");

const router = express.Router();

router.post("/visits", verifyUserToken, postVisits);

module.exports = router;
