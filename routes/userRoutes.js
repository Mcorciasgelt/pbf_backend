const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')


router.get('/test', (req, res) => {
  res.send(' Ruta /api/users/test funcionando');
});

// Rutas USER GET que requieren autenticaciíon 
router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({
        mensaje: 'Usuario autenticado',
        usuario: req.user
      })
  });



module.exports = router;