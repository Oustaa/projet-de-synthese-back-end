require("dotenv").config();
const jwt = require("jsonwebtoken");

function checkTocken(req, res, next) {
  const token = req.headers["authorization"];
  console.log(token);
  if (token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, store) {
      if (err) return res.status(505).json({ message: "something went wrong" });
      req.store = store;
      next();
    });
  else next();
}

module.exports = { checkTocken };
