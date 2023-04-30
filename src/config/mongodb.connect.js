const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/e-commerce";

function mongoConnect() {
  return mongoose.connect(URI);
}

module.exports = mongoConnect;
