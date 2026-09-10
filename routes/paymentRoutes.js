const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Todas las rutas de pago requieren autenticación
router.use(authController.protect);

router.post('/checkout-session', paymentController.getCheckoutSession);
router.get('/my-payments', paymentController.getMyPayments);

module.exports = router;