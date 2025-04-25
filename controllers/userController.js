const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Tarea = require('../models/Tarea')

// función para obtener los miembros de la familia
const obtenerMiembrosFamilia = async (req, res) => {
  try {
    const familiaId = req.user.familiaId

    // Buscamos los usuarios de la familia
    const miembros = await User.find({ familiaId }).select('-password')

    res.status(200).json({
      mensaje: 'Miembros de la familia obtenidos correctamente',
      miembros,
    });
  } catch (error) {
    console.error('Error al obtener los miembros de la familia:', error.message)
    res.status(500).json({ mensaje: 'Error interno del servidor.' })
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

// función para obtener los datos del usuario que pintará en el Dashboard (vistas al front)

const obtenerDashboard = async (req, res) => {
  try {
    const usuario = req.user;
    const respuesta = {
      tipo: usuario.tipo,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        foto: usuario.foto,
        email: usuario.email
      }
    };

    if (usuario.tipo === 'padre') {
      // extraer 3 tareas siguientes de la familia
      const tareas = await Tarea.find({ familiaId: usuario.familiaId })
        .sort({ fechaEntrega: 1 })
        .limit(3);

      // creo un array con los hijos que usaré más adelante
      const hijos = await User.find({
        familiaId: usuario.familiaId,
        tipo: 'hijo'
      }).select('nombre foto _id');

      respuesta.proximasTareas = tareas;
      respuesta.hijos = hijos;

    } else if (usuario.tipo === 'hijo') {
      // extraer 3 tareas siguientes del hijo
      const tareas = await Tarea.find({
        hijosAsociados: usuario._id
      }).sort({ fechaEntrega: 1 })
        .limit(3);

      respuesta.proximasTareas = tareas;
    }

    res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error en dashboard:', error.message);
    res.status(500).json({ mensaje: 'Error al cargar la información del panel.' });
  }
};

// función para eliminar un usuario miembro de la familia (solo el padre)

const User = require('../models/User');

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const familiaId = req.user.familiaId;

    // usuario miembro a eliminar
    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // tiene que pertenecer a la misma familia
    if (usuario.familiaId.toString() !== familiaId.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permisos para eliminar este usuario.' });
    }

    // no se puede eliminar a sí mismo
    if (usuario._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ mensaje: 'No puedes eliminar tu propio usuario.' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};


module.exports = {
  obtenerMiembrosFamilia,
  crearMiembro,
  obtenerDashboard,
  eliminarUsuario
};