const mongoose = require("mongoose");

const storeSchema = {
  name: { type: String, required: true, unique: true },
  bg_image: String,
  avatar: String,
  location: Object,
  currency: { type: String, default: "USD" },
  email: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  phone_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
  followers: { type: [String], default: 0 },
};

module.exports = mongoose.model("store", storeSchema);
