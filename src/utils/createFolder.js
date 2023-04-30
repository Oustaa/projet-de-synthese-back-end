const fs = require("fs");
const path = require("path");

function createFolder(storeName) {
  // check if folder exists
  const imagesFolderPath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "images",
    storeName || "testfolder"
  );

  if (!fs.existsSync(imagesFolderPath)) {
    // create a folder called "images"
    fs.mkdirSync(imagesFolderPath);
  }
  return imagesFolderPath;
}

module.exports = createFolder;
