const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'A190237a', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Por favor proporciona email y contraseña' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Email o contraseña incorrectos' });
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'No has iniciado sesión' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_provisoria');
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'El usuario perteneciente a este token ya no existe' });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Token inválido o expirado' });
    }
};