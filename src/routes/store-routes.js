const express = require("express");

const { getStore, createStore } = require("../controllers/store-controller");

const router = express.Router();

router.get("/", getStore);
router.post("/", createStore);

module.exports = router;
