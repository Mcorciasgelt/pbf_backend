const User = require('../models/User');
const Familia = require('../models/Familia');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Función para login de usuario
const login = async (req, res) => {
    try {
      // 1. Tomamos email y contraseña del body
      const { email, password } = req.body;
  
      // 2. Validamos que se hayan enviado los dos campos
      if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
      }
  
      // 3. Buscamos al usuario por email
      const usuario = await User.findOne({ email });
  
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales de email inválidas.' });
      }
  
      // 4. Comparamos la contraseña enviada con la guardada (hasheada)
      const passwordCorrecta = await bcrypt.compare(password, usuario.password);
  
      if (!passwordCorrecta) {
        return res.status(401).json({ mensaje: 'Credenciales de password inválidas.' });
      }
  
      // 5. Creamos el token JWT
      const token = jwt.sign(
        { id: usuario._id, tipo: usuario.tipo, familiaId: usuario.familiaId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      // 6. Enviamos el token y los datos del usuario
      res.status(200).json({
        mensaje: 'Login exitoso.',
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          tipo: usuario.tipo,
          familiaId: usuario.familiaId,
          foto: usuario.foto,
        }
      });
  
    } catch (error) {
      console.error('Error en login:', error.message);
      res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  };
  

// Exportamos la función para usarla en las rutas
module.exports = { registrarPadre, login };