const { Schema, model, Types } = require("mongoose");

const storeSchema = Schema(
  {
    items: {
      type: [
        {
          product: { type: Types.ObjectId, ref: "Product" },
          qte: Number,
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
          zipCode: String,
        },
      },
    },
    total: { type: Types.Decimal128 },
    orderedOn: { type: Date, default: Date.now },
    state: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Order", storeSchema);
