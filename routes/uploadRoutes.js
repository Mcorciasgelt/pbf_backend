const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')



router.post('/', authMiddleware, upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se subió ninguna imagen' })
  }

  res.status(200).json({
    mensaje: 'Imagen subida correctamente',
    path: `/uploads/${req.file.filename}`
  })
})

module.exports = router;