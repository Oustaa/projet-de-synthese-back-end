const express = require("express");

const { verifyUserToken } = require("../middlewares/verifyUserToken");

const { postVisit, postSearch } = require("../controllers/user-controller");

const router = express.Router();

router.post("/visits", verifyUserToken, postVisit);
router.post("/search", verifyUserToken, postSearch);

module.exports = router;
