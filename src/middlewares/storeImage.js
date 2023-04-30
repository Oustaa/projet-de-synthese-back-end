const fs = require("fs");
const multer = require("multer");
const createFolder = require("../utils/createFolder");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, createFolder(req.body.name || req.store?.name));
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

async function storeImage(req, res, next) {
  try {
    const upload = multer({
      storage,
      fileFilter: function (req, file, cb) {
        // Only allow image files
        if (!file.mimetype.startsWith("image/")) {
          return cb(new Error("Only image files are allowed!"));
        }
        cb(null, true);
      },
    });
    upload.array("images", 5)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        // A Multer error occurred when uploading.
        return res.status(400).json({ error: "Error uploading file" });
      } else if (err) {
        console.log(err);
        // An unknown error occurred when uploading.
        return res.status(400).json({ error: "Error uploading file" });
      }

      next();
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { storeImage };
