const fs = require("fs");
const path = require("path");

const fullPath = path.join(__dirname, "..", "..", "public", "images");

fs.readdir(fullPath, (error, files) => {
  if (error) console.log(error);
  files.forEach((file) => console.log(file));
});
