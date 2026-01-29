const multer = require("multer")
const { randomString } = require("../utils/helper")


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp")
  },

  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname)
  }
})


const upload = multer({storage})

module.exports = upload