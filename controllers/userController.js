const bcrypt = require('bcryptjs')
const User = require('../models/User');

// función para obtener los miembros de la familia
const obtenerMiembrosFamilia = async (req, res) => {
  try {
    const familiaId = req.user.familiaId;

    // Buscamos los usuarios de la familia
    const miembros = await User.find({ familiaId }).select('-password');

    res.status(200).json({
      mensaje: 'Miembros de la familia obtenidos correctamente',
      miembros,
    });
  } catch (error) {
    console.error('Error al obtener los miembros de la familia:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};


// función para crear un miembro nuevo (solo lo pueden hacer los tipo padres)
const crearMiembro = async (req, res) => {
  try {
    const { nombre, email, password, tipo, foto } = req.body;

    if (req.user.tipo !== 'padre') {
        return res.status(403).json({ mensaje: 'Solo los usuarios tipo padre pueden crear nuevos miembros.' });
      }

    if (!nombre || !email || !password || !tipo) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }

    if (!['padre', 'hijo'].includes(tipo)) {
      return res.status(400).json({ mensaje: 'El tipo debe ser "padre" o "hijo".' });
    }

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Ese email ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoMiembro = new User({
      nombre,
      email,
      password: hashedPassword,
      tipo,
      foto: foto || '',
      familiaId: req.user.familiaId,
    });

    const miembroGuardado = await nuevoMiembro.save();

    res.status(201).json({
      mensaje: 'Miembro de la familia creado correctamente.',
      miembro: {
        id: miembroGuardado._id,
        nombre: miembroGuardado.nombre,
        email: miembroGuardado.email,
        tipo: miembroGuardado.tipo,
        foto: miembroGuardado.foto,
        familiaId: miembroGuardado.familiaId
      }
    });

  } catch (error) {
    console.error('Error al crear miembro:', error.message);
    res.status(500).json({ mensaje: 'Error al crear miembro de la familia.' });
  }
};

module.exports = {
  obtenerMiembrosFamilia,
  crearMiembro
};