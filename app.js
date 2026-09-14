const path = require('path');
const express = require('express');
const cors = require('cors');

// 1. Importar rutas
const userRouter = require('./routes/userRoutes');
const commentRouter = require('./routes/commentRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const contactRouter = require('./routes/contactRoutes'); // <- Agregar esta línea

// 2. Inicializar la aplicación Express
const app = express();

// 3. Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Servir archivos estáticos del Frontend
app.use(express.static(path.join(__dirname, 'public')));

// 5. Montar las rutas de la API
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/contact', contactRouter); // <- Registrar esta ruta

// Ruta básica de salud
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API activa y respondiendo' });
});

module.exports = app;