const mongoose = require("mongoose");

const categorySchema = {
  name: { type: String },
  subCategories: { type: [Object], defaul: [] },
  image: { type: String, default: "" },
};

module.exports = mongoose.model("Category", categorySchema);
