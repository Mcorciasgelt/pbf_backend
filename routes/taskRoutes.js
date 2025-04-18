const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const { crearTarea, obtenerTareas } = require('../controllers/taskController')


router.post('/', authMiddleware, crearTarea)

router.get('/', authMiddleware, obtenerTareas)


module.exports = router;