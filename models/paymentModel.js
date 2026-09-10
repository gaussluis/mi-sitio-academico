const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El pago debe pertenecer a un usuario']
    },
    recursoComprado: {
        type: String,
        required: [true, 'Debe especificarse el material o recurso comprado']
    },
    monto: {
        type: Number,
        required: [true, 'El monto es obligatorio']
    },
    estatusPago: {
        type: String,
        enum: ['pendiente', 'completado', 'fallido'],
        default: 'pendiente'
    },
    stripePaymentId: {
        type: String,
        required: [true, 'El ID de pago de Stripe es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);