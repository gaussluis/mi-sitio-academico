const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Selecciona la variable de entorno o usa la cadena por defecto
        const dbURI = process.env.DATABASE_ATLAS || process.env.DATABASE_LOCAL || 'mongodb://127.0.0.1:27017/sitio_academico';

        const conn = await mongoose.connect(dbURI);
        console.log(`✅ Conexión exitosa a MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;