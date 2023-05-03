const fs = require("fs");
const multer = require("multer");
const createFolder = require("../utils/createFolder");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, createFolder(req.store.name));
  },
  filename: function (req, file, cb) {
    req.imgname = file.fieldname;
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

async function storeImage(req, res, next, fieldName) {
  try {
    let fieldName;
    const upload = multer({
      storage,
      fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
          return cb(new Error("Only image files are allowed!"));
        }
        cb(null, true);
      },
    });
    upload.single(req.params.type)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        // A Multer error occurred when uploading.
        return res.status(400).json({ error: "Error uploading file" });
      } else if (err) {
        console.log(err);
        // An unknown error occurred when uploading.
        return res.status(400).json({ error: "Error uploading file" });
      }

      res.status(202).json({});
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { storeImage };
