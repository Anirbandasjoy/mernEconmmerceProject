const multer = require("multer");
const path = require("path");
const { uploadDir } = require("../secret");

const uploadFile = uploadDir;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFile);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const timestamp = Date.now();
    const newFilename = `${timestamp} - ${file.originalname.replace(
      extname,
      ""
    )}${extname}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
