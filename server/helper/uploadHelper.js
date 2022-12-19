const multer = require("multer");
const uploader = {};

//@desc define storage file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") {
      cb(null, "./public/profileImage");
    } else if (file.fieldname === "company_logo") {
      cb(null, "./public/profileImage");
    } else if (file.fieldname === "bus_image") {
      cb(null, "./public/busImages");
    } else if (file.fieldname === "receipt") {
      cb(null, "./public/receipt");
    } else {
      cb(null, "./public/busImage");
    }
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

//@desc validations
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|PNG|gif|JPEG)$/)) {
    return cb(new Error("File format not supported! "), false);
  }
  cb(null, true);
};

module.exports = multer({ storage: storage, fileFilter: fileFilter });
