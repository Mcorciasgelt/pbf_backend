const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { enviarEmailDiario, enviarEmailSemanal } = require('../controllers/emailController');

router.post('/diario', authMiddleware, enviarEmailDiario);
router.post('/semanal', authMiddleware, enviarEmailSemanal)

module.exports = router;
