const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StoreModule = require("../models/store.model");

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
      if (store.deleted_at) {
        return res.status(307).json({ message: "Acocount deleted" });
      }
      return res.status(400).json({
        message: "Invalid Credentials",
        email: true,
        password: false,
      });
    }

    const token = jwt.sign(
      { id: store._id, name: store.name },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30min" }
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

async function isloggedin(req, res) {
  try {
    const token = req.cookies?.token || req.headers.access_token;
    if (!token)
      return res.status(401).json({ message_error: "please provide a token" });

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, store) => {
      if (err) {
        return res.status(401).json({ message_error: err.message, err });
      }

      return res.status(200).json({ store });
    });
  } catch (error) {
    res.status(500).json({ message_error: error.message, error });
  }
}

async function confirmPassword(req, res) {
  const password = req.body.password;
  const id = req.store.id;

  if (!id) return res.status(401).json({ message: "Please log in" });
  try {
    const store = await StoreModule.findById(id);

    if (!store) return res.status(401).json({ message: `no store found` });

    const matched = await bcrypt.compare(password, store.password);

    if (matched) return res.status(200).json({ matched });

    return res.status(403).json({ matched });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { login, isloggedin, confirmPassword };
