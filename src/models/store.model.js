const mongoose = require("mongoose");

const storeSchema = {
  name: { type: String, required: true, unique: true },
  bg_image: { type: String, default: "" },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  location: Object,
  address: { type: String, default: "" },
  currency: { type: String, default: "USD" },
  email: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  phone_verified: { type: Boolean, default: false },
  followers: { type: [String], default: [] },
  visits: { type: [Object], default: 0 },
  views: { type: [Object], default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
};

module.exports = mongoose.model("store", storeSchema);
