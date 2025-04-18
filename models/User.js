const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  nombre: {
    type: String,
    required: true,
  },

  
  email: {
    type: String,
    required: true,
    unique: true,
  },

  //(hasheada)
  password: {
    type: String,
    required: true,
  },

  // padre o hijo
  tipo: {
    type: String,
    enum: ['padre', 'hijo'],
    required: true,
  },

  // Foto de perfil (opcional)
  foto: {
    type: String,
    default: '',
  },

  
  familiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Familia',
    required: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;