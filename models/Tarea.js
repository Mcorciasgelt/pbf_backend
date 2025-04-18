const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },

  canal: {
    type: String,
    enum: ['WhatsApp', 'Agenda', 'Email', 'Clickedu', 'Grupo Padres', 'Ampa'],
    required: true,
  },

  // fecha en que se debe realizar la tarea
  fechaEntrega: {
    type: Date,
    required: true,
  },

  // copia exacta del mensaje recibido
  descripcion: {
    type: String,
    required: true,
  },

  asignatura: {
    type: String,
    enum: ['Global', 'Matemáticas', 'Lengua', 'Social Science', 'Natural', 'Ingles', 'Hebreo', 'Otra'],
    required: true,
  },

  padreResponsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  hijosAsociados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],

  // familia a la que pertenece 
  familiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Familia',
    required: true,
  },

  completada: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true, 
});

const Tarea = mongoose.models.Tarea || mongoose.model('Tarea', tareaSchema);
module.exports = Tarea;