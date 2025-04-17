const express = require('express');
const router = express.Router();

const { registrarPadre } = require('../controllers/authController');


router.get('/test', (req, res) => {
  res.send(' Ruta /api/auth/test funcionando');
});


// Ruta POST para crear padre + familia
router.post('/register', registrarPadre);

module.exports = router;