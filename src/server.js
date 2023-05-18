require("dotenv").config();
const os = require("os");
const http = require("http");
const app = require("./app");
const cluster = require("cluster");
const mongoConnect = require("./config/mongodb.connect");
const { connection } = require("mongoose");
const server = http.createServer(app);

connection.once("open", () => {
  console.log("MongoDB connected successfully");

  if (cluster.isMaster) {
    console.log("Master has been started..");
    const NUM_WORKERS = os.cpus().length;
    console.log(NUM_WORKERS);
    for (let i = 0; i < 2; i++) {
      cluster.fork();
    }
  } else {
    console.log("Worker process started");
    server.listen(8000, () => console.log("server started"));
  }
});

connection.on("error", (err) => {
  console.error(err);
});

mongoConnect();
