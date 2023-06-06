const { Schema, model, Types } = require("mongoose");

const storeSchema = Schema(
  {
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
    questions: {
      type: [
        {
          product_id: String,
          text: String,
          user: { type: Types.ObjectId, ref: "User" },
        },
      ],
      default: [],
    },
    orders: {
      type: [
        {
          order: { type: Types.ObjectId, ref: "Order" },
          item: [
            {
              product: { type: Types.ObjectId, ref: "Product" },
              qte: Number,
              status: { type: String, default: "pending" },
            },
          ],
          adress: {
            county: String,
            city: String,
            street: String,
            zipCode: String,
          },
        },
      ],
    },
    visits: { type: [Object], default: 0 },
    views: { type: [Object], default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = model("store", storeSchema);
