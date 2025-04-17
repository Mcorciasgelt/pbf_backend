const User = require('../models/User');
const Familia = require('../models/Familia');
const bcrypt = require('bcryptjs');

// Función para registrar un nuevo usuario PADRE junto a su familia
const registrarPadre = async (req, res) => {
  try {
    // 1. Recibimos los datos desde el body de la petición
    const { nombreUsuario, email, password, nombreFamilia } = req.body;

    // 2. Validamos que todos los campos estén presentes
    if (!nombreUsuario || !email || !password || !nombreFamilia) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }

    // 3. Verificamos si el email ya está en uso
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado.' });
    }

    // 4. Creamos una nueva familia con el nombre recibido
    const nuevaFamilia = new Familia({ nombre: nombreFamilia });
    const familiaGuardada = await nuevaFamilia.save();

    // 5. Hasheamos la contraseña del usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Creamos al usuario tipo PADRE asociado a la familia
    const nuevoUsuario = new User({
      nombre: nombreUsuario,
      email,
      password: hashedPassword,
      tipo: 'padre',
      familiaId: familiaGuardada._id,
    });

    const usuarioGuardado = await nuevoUsuario.save();

    // 7. Devolvemos una respuesta con los datos básicos del usuario y familia
    res.status(201).json({
      mensaje: 'Usuario padre y familia creados correctamente.',
      usuario: {
        id: usuarioGuardado._id,
        nombre: usuarioGuardado.nombre,
        email: usuarioGuardado.email,
        tipo: usuarioGuardado.tipo,
        familiaId: usuarioGuardado.familiaId,
      },
      familia: {
        id: familiaGuardada._id,
        nombre: familiaGuardada.nombre,
      },
    });

  } catch (error) {
    console.error('Error en el registro:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Exportamos la función para usarla en las rutas
module.exports = { registrarPadre };