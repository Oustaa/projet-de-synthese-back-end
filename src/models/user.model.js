const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    name: {
      type: {
        lastname: { type: String, required: true },
        firstname: { type: String, required: true },
      },
    },
    currency: { type: String, default: "USD" },
    birthday: { type: Date },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    phone_verified: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, default: false },
    password: { type: String, required: true, minlength: 4 },
    avatar: { type: String, default: "" },
    cover_img: { type: String, default: "" },
    adress: { type: String, required: true },
    wishlist: { type: [String], default: [] },
    visists: { type: [String], default: [] },
    search: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
