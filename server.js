const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

// Conectar a la base de datos
connectDB();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});

// Manejo de rechazos de promesas no capturados
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Cerrando servidor...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});