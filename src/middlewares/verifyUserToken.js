require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyUserToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(403).json({ message: "please provide a token" });

  if (token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
      if (err) return res.status(403).json({ message: "something went wrong" });
      if (user.type !== "user")
        return res
          .status(403)
          .json({ message: "you are not allowed to access this as a store" });
      req.user = user;
      next();
    });
}

module.exports = { verifyUserToken };
