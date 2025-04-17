const mongoose = require('mongoose');

const familiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },

  // de la familia (opcional)
  foto: {
    type: String,
    default: '',
  },

}, {
  timestamps: true, 
});

const Familia = mongoose.model('Familia', familiaSchema);
module.exports = Familia;