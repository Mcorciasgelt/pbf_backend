const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conexión a BBDD');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  }
};

module.exports = connectDB;