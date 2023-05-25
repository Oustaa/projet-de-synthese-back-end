const { Schema, model } = require("mongoose");

const categorySchema = Schema({
  name: { type: String },
  subCategories: { type: [Object], defaul: [] },
  image: { type: String, default: "" },
});

module.exports = model("Category", categorySchema);
