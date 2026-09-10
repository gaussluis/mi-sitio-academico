const Stripe = require('stripe');
const Payment = require('../models/paymentModel');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_tu_llave_de_stripe');

exports.getCheckoutSession = async (req, res) => {
    try {
        const { materialName, amount } = req.body;

        if (!materialName || !amount) {
            return res.status(400).json({ status: 'fail', message: 'Nombre del material y monto son requeridos' });
        }

        // 1. Crear la sesión de Checkout en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/?payment=success`,
            cancel_url: `${req.protocol}://${req.get('host')}/?payment=cancel`,
            customer_email: req.user.email,
            client_reference_id: req.user.id,
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: materialName,
                            description: 'Material académico digital'
                        },
                        unit_amount: amount * 100 // Stripe requiere el monto en centavos
                    },
                    quantity: 1
                }
            ]
        });

        // 2. Crear el registro previo del pago en MongoDB
        await Payment.create({
            usuario: req.user.id,
            recursoComprado: materialName,
            monto: amount,
            stripePaymentId: session.id,
            estatusPago: 'completado' // Simplificado para desarrollo
        });

        res.status(200).json({
            status: 'success',
            session
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ usuario: req.user.id }).sort('-fecha');
        res.status(200).json({
            status: 'success',
            results: payments.length,
            data: { payments }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};