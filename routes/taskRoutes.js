const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const { crearTarea, obtenerTareas, obtenerTareaPorId, editarTarea, eliminarTarea, marcarCompletada } = require('../controllers/taskController')

// Ruta TASK para crear tarea
router.post('/', authMiddleware, crearTarea)

// Ruta TASK para obtener tarea
router.get('/', authMiddleware, obtenerTareas)

// Ruta TASK para obtener tarea
router.get('/:id', authMiddleware, obtenerTareaPorId)

// Ruta TASK para editar tarea
router.put('/:id', authMiddleware, editarTarea)

// Ruta TASK para elininar tarea
router.delete('/:id', authMiddleware, eliminarTarea)

// Ruta TASK para marcar completada una tarea
router.patch('/:id', authMiddleware, marcarCompletada)

module.exports = router;