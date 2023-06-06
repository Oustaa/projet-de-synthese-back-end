const { Schema, model, Types } = require("mongoose");

const cartSchema = Schema({
  cartItems: [
    {
      product: {
        type: Types.ObjectId,
        ref: "Product",
      },
      store: {
        type: Types.ObjectId,
        ref: "store",
      },
      qte: {
        type: Number,
        default: 1,
      },
      saveLater: { type: Boolean, default: false },
      price: Number,
    },
  ],
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  totalPrice: { type: Number, default: 0 },
});

module.exports = model("Cart", cartSchema);
