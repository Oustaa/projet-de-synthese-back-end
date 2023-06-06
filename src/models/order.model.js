const { Schema, model, Types } = require("mongoose");

const storeSchema = Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User" },
    items: {
      type: [
        {
          product: { type: Types.ObjectId, ref: "Product" },
          store: { type: Types.ObjectId, ref: "Store" },
          qte: Number,
          price: Number,
          status: { type: String, default: "pending" },
        },
      ],
    },
    user: {
      type: {
        fullname: String,
        email: String,
        phone: String,
        adress: {
          county: String,
          city: String,
          street: String,
          zipCode: Number,
        },
      },
    },
    total: { type: Types.Decimal128 },
    state: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = model("Order", storeSchema);
