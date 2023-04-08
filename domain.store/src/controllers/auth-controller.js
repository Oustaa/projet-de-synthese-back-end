require("dotenv").config({ path: "../../../.env" });

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StoreModule = require("../../../modules/store.model");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const store = await StoreModule.findOne({ email });

    if (!store) {
      return res.status(400).json({
        message: "Invalid Credentials",
        password: true,
        email: false,
      });
    }
    const isMatch = await bcrypt.compare(password, store.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
        email: true,
        password: false,
      });
    }

    const token = jwt.sign(
      { id: store._id, name: store.name },
      ACCESS_TOKEN_SECRET
    );
    res.cookie("token", token, {
      maxAge: 43200,
      secure: true,
      path: "http://localhost:3000/",
    });

    res.status(200).json({ accessToken: token, name: store.name });
  } catch (err) {
    res.status(500).json({ message_error: err.message, err });
  }
}
async function isloggedin(req, res) {}

module.exports = { login };
