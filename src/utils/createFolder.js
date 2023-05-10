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
    storeName
  );

  if (!fs.existsSync(imagesFolderPath)) {
    // create a folder called "images"
    fs.mkdirSync(
      path.join(__dirname, "..", "..", "public", "images", storeName)
    );
    fs.mkdirSync(
      path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        storeName,
        "products"
      )
    );
    fs.mkdirSync(
      path.join(__dirname, "..", "..", "public", "images", storeName, "images")
    );
  }
  return imagesFolderPath;
}

module.exports = createFolder;
