const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // cabecera Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'No autorizado. Token no proporcionado.' });
    }

    // Extrae el token
    const token = authHeader.split(' ')[1];

    // Verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica usuario
    const usuario = await User.findById(decoded.id).select('-password');

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado.' });
    }

    req.user = usuario;

    next();

  } catch (error) {
    console.error('Error en middleware de autenticación:', error.message);
    res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};


module.exports = authMiddleware;