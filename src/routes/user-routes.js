const express = require("express");

const { verifyUserToken } = require("../middlewares/verifyUserToken");

const {
  postVisit,
  postSearch,
  postWishList,
} = require("../controllers/user-controller");

const router = express.Router();

router.post("/visits", verifyUserToken, postVisit);
router.post("/search", verifyUserToken, postSearch);
router.post("/wishlist", verifyUserToken, postWishList);

module.exports = router;
