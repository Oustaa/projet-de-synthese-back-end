const mongoose = require("mongoose");

const productSchema = {
  // products information
  store_id: {
    type: mongoose.Types.ObjectId,
    ref: "store",
    required: true,
  },
  title: { type: String, require: true },
  price: { type: Number, require: true },
  currency: { type: String, default: "USD" },
  images: { type: [String], require: true },
  specifications: { type: [Object], default: [] },
  about: { type: [String], require: true },
  QandA: {
    type: [
      { question: String, answer: String, vote: { type: Number, default: 0 } },
    ],
    default: [],
  },
  reviewsOverview: {
    type: Object,
    default: {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
    },
  },
  description: { type: String, default: "" },
  reviews: { type: Object, default: 0 },
  extra_images: [String],
  categories_id: { type: [String], require: true },
  subcategories_id: { type: [String], require: true },
  inserted_at: { type: Date, default: Date.now() },
  // for stock management
  available: { type: Boolean, default: false },
  stock_Quantity: { type: Number, default: 0 },
  // statistics
  views: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
};

module.exports = mongoose.model("Product", productSchema);
