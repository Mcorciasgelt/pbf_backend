const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/")
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpg|jpeg|png|gif/;
    const extension = tiposPermitidos.test(path.extname(file.originalname).toLowerCase())
    const mimetype = tiposPermitidos.test(file.mimetype);
  
    if (extension && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  };
  
  const upload = multer({
    storage,
    fileFilter
  })
  
  module.exports = upload