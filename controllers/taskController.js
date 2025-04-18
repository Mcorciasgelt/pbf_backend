const Tarea = require('../models/Tarea');

// FUNCIÓN PARA CREAR NUEVAS TAREAS
const crearTarea = async (req, res) => {
  try {
    const {
      titulo,
      canal,
      fechaEntrega,
      descripcion,
      asignatura,
      hijosAsociados,
    } = req.body;

    if (!titulo || !canal || !fechaEntrega || !descripcion || !asignatura || !hijosAsociados) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }

    // Crear nueva tarea
    const nuevaTarea = new Tarea({
      titulo,
      canal,
      fechaEntrega,
      descripcion,
      asignatura,
      padreResponsable: req.user._id,
      hijosAsociados,
      familiaId: req.user.familiaId,
    });

    const tareaGuardada = await nuevaTarea.save();

    res.status(201).json({
      mensaje: 'Tarea creada correctamente',
      tarea: tareaGuardada,
    });

  } catch (error) {
    console.error('Error al crear tarea:', error.message);
    res.status(500).json({ mensaje: 'Error al guardar la tarea.' });
  }
};

// FUNCIÓN PARA OBTENER LAS TAREAS DEL USUARIO
const obtenerTareas = async (req, res) => {
    try {
      let tareas;
  
      if (req.user.tipo === 'padre') {
        // padre uede ver todas las tareas de su familia
        tareas = await Tarea.find({ familiaId: req.user.familiaId }).sort({ fechaEntrega: 1 });
      } else {
        // hijo puede ver solo tareas en las que está asignado
        tareas = await Tarea.find({ hijosAsociados: req.user._id }).sort({ fechaEntrega: 1 });
      }
  
      res.status(200).json({
        mensaje: 'Tareas obtenidas correctamente',
        tareas
      });
    } catch (error) {
      console.error('Error al obtener tareas:', error.message);
      res.status(500).json({ mensaje: 'Error al recuperar las tareas.' });
    }
  };



module.exports = { 
    crearTarea,
    obtenerTareas
};