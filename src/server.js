require("dotenv").config();
const http = require("http");
const app = require("./app");
const mongoConnect = require("./config/mongodb.connect");
const { connection } = require("mongoose");
const server = http.createServer(app);

connection.once("open", () => {
  console.log("MongoDB connected successfully");
  server.listen(8000, () => console.log("server started"));
});

connection.on("error", (err) => {
  console.error(err);
});

mongoConnect();

