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

// FUNCIÓN PARA OBTENER LAS TAREAS DEL USUARIO (AGREGUÉ LUEGO FILTROS)
const obtenerTareas = async (req, res) => {
    try {
      let tareas;

        //esto es por el filtro que voy a recibir los datos de la url
        const { completada, hijoId, padreId, desde, hasta } = req.query
        const filtros = {}
  
      if (req.user.tipo === 'padre') {
        // padre uede ver todas las tareas de su familia
        // el filtro empieza vacío y lo voy completando con las comprobaciones que se hacen en los if
        filtros.familiaId = req.user.familiaId

        if (hijoId) {
            filtros.hijosAsociados = hijoId 
        }

        if (padreId) {
            filtros.padreResponsable = req.padreId
        }

      } else {
        filtros.hijosAsociados = req.user._id
      }


      // agrego el bloque con las fechas por si quisiera filtrar también por fechas
      if (desde || hasta) {
        filtros.fechaEntrega = {}

        if (desde) {
            filtros.fechaEntrega.$gte = new Date(desde)
        }

        if (hasta) {
            filtros.fechaEntrega.$lte = new Date(hasta)
        }
      }
      
      // opción a filtrar por el estado de la tarea
      if (completada === "true") {
        filtros.completada = true
      } else if (completada === "false") {
        filtros.completada = false
      }

      //hago el mismo FIND que hacía anteriormente pero ahora con todo el objetio de filtros construido
      tareas = await Tarea.find(filtros)
        .populate('hijosAsociados', 'nombre')
        .populate('padreResponsable', 'nombre')
        .sort({ fechaEntrega: 1 });


      res.status(200).json({
        mensaje: 'Tareas obtenidas correctamente',
        tareas
      });
    } catch (error) {
      console.error('Error al obtener tareas:', error.message);
      res.status(500).json({ mensaje: 'Error al recuperar las tareas.' });
    }
  };

// FUNCIÓN PARA EDITAR TAREAS (SOLO USUARIOS TIPO PADRE)

const editarTarea = async (req, res) => {
    try {
      const tareaId = req.params.id;
  
      // solo los padres puedan editar tareas
      if (req.user.tipo !== 'padre') {
        return res.status(403).json({ mensaje: 'Solo los padres pueden editar tareas.' });
      }
  
      // buscar la tarea
      const tarea = await Tarea.findById(tareaId);
  
      if (!tarea || tarea.familiaId.toString() !== req.user.familiaId.toString()) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada o no pertenece a tu familia.' });
      }
  
      // actualizar los campos (los que vienen en el body)
      const campos = [
        'titulo', 'canal', 'fechaEntrega', 'descripcion',
        'asignatura', 'hijosAsociados', 'padreResponsable'
      ];
  
      campos.forEach(campo => {
        if (req.body[campo] !== undefined) {
          tarea[campo] = req.body[campo];
        }
      });
  
      const tareaActualizada = await tarea.save();
  
      res.status(200).json({
        mensaje: 'Tarea actualizada correctamente.',
        tarea: tareaActualizada
      });
  
    } catch (error) {
      console.error('Error al editar tarea:', error.message);
      res.status(500).json({ mensaje: 'Error al actualizar la tarea.' });
    }
  };

// FUNCIÓN PARA ELIMINAR UNA TAREA (SOLO USUARIO TIPO PADRE)

const eliminarTarea = async (req, res) => {
    try {
      const tareaId = req.params.id;
  
      // solo padre puede eliminar
      if (req.user.tipo !== 'padre') {
        return res.status(403).json({ mensaje: 'Solo los padres pueden eliminar tareas.' });
      }
  
      // busca
      const tarea = await Tarea.findById(tareaId);
  
      // verificar que existe y que sea de la familia
      if (!tarea || tarea.familiaId.toString() !== req.user.familiaId.toString()) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada o no pertenece a tu familia.' });
      }
  
      await tarea.deleteOne();
  
      res.status(200).json({ mensaje: 'Tarea eliminada correctamente.' });
  
    } catch (error) {
      console.error('Error al eliminar tarea:', error.message);
      res.status(500).json({ mensaje: 'Error al eliminar la tarea.' });
    }
  };

  // FUNCIÓN PARA MARCAR COMPLETADA UNA TAREA (TIPO PADRE TODAS / HIJOS SOLO LAS DE ELLOS)


  const marcarCompletada = async (req, res) => {
  try {
    const tareaId = req.params.id;
    const { completada } = req.body;

    // revisa el estado actual
    if (typeof completada !== 'boolean') {
      return res.status(400).json({ mensaje: 'El campo "completada" debe ser true o false.' });
    }

    const tarea = await Tarea.findById(tareaId);

    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    // valida si es de la familia
    if (tarea.familiaId.toString() !== req.user.familiaId.toString()) {
      return res.status(403).json({ mensaje: 'No tienes acceso a esta tarea.' });
    }

    // aquí es donde hace la diferencia entre hijo o padre
    if (
      req.user.tipo === 'hijo' &&
      !tarea.hijosAsociados.some(hijoId => hijoId.toString() === req.user._id.toString()) //aunque cada hijo solo ve sus tareas, aquí igual volvemos a validar para mantener la seguradad del caso
    ) {
      return res.status(403).json({ mensaje: 'No estás asignado a esta tarea por lo que no puedaes marcarla como completada.' });
    }

    tarea.completada = completada;
    const tareaActualizada = await tarea.save();

    res.status(200).json({
      mensaje: 'Tarea actualizada correctamente.',
      tarea: tareaActualizada
    });

  } catch (error) {
    console.error('Error al marcar tarea:', error.message);
    res.status(500).json({ mensaje: 'Error al marcar la tarea como completada.' });
  }
};

const obtenerTareaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // busca la tarea por id y hace el populate para traer el objeto de esos id de padre o hijo 
    const tarea = await Tarea.findById(id)
      .populate('padreResponsable', 'nombre')
      .populate('hijosAsociados', 'nombre');

    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
    }

    if (req.user.familiaId.toString() !== tarea.familiaId.toString()) {
      return res.status(403).json({ mensaje: 'No tienes acceso a esta tarea.' });
    }

    res.status(200).json({ tarea });
  } catch (error) {
    console.error('Error al obtener la tarea por ID:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener la tarea.' });
  }
};


module.exports = { 
    crearTarea,
    obtenerTareas,
    editarTarea,
    eliminarTarea,
    marcarCompletada,
    obtenerTareaPorId
};