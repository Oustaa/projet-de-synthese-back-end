const { Schema, model, Types } = require("mongoose");

const cartSchema = Schema({
  cartItems: [
    {
      product: {
        type: Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: Number,
    },
  ],
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  totalPrice: Number,
});

module.exports = model("Cart", cartSchema);
