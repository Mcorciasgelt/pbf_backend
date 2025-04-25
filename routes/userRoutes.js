const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const { obtenerMiembrosFamilia } = require('../controllers/userController');
const { crearMiembro } = require('../controllers/userController');
const { obtenerDashboard } = require('../controllers/userController');


// Rutas USER GET que requieren autenticaciíon 
router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({
        mensaje: 'Usuario autenticado',
        usuario: req.user
      })
  });

  // Ruta USER para ver la familia
router.get('/family', authMiddleware, obtenerMiembrosFamilia)

// Ruta USER para crear un miembro
router.post('/', authMiddleware, crearMiembro)

// Ruta USER para obtener el dashboard (tanto de padre como de hijo)
router.get("/dashboard", authMiddleware, obtenerDashboard)


// Ruta USER para borrar un miembro
router.delete('/:id', authMiddleware, eliminarUsuario)



module.exports = router;