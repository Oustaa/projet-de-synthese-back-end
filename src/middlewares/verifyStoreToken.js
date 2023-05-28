require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyStoreToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(403).json({ message: "please provide a token" });

  if (token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, store) {
      if (err)
        return res
          .status(505)
          .json({ message: "something went wrong", error: err });
      if (store.type !== "store")
        return res
          .status(403)
          .json({ message: "you are not allowed to access this as a user" });
      req.store = store;
      next();
    });
}

module.exports = { verifyStoreToken };
