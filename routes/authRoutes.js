const express = require('express');
const router = express.Router();

const { registrarPadre, login } = require('../controllers/authController');


router.get('/test', (req, res) => {
  res.send(' Ruta /api/auth/test funcionando');
});


// RutaS AUTHMIDDLEWARE POST para crear padre + familia
router.post('/register', registrarPadre);

// RutaS AUTHMIDDLEWARE POST para hacer login
router.post('/login', login)


module.exports = router;