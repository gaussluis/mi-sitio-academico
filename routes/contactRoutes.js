const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');

router.post('/', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor completa todos los campos requeridos.'
      });
    }

    const nuevoMensaje = await Contact.create({ nombre, email, mensaje });

    res.status(201).json({
      status: 'success',
      data: nuevoMensaje
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al guardar el mensaje.'
    });
  }
});

module.exports = router;