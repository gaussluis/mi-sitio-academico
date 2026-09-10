const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El comentario debe estar asociado a un usuario']
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje no puede estar vacío'],
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

// Poblar los datos del usuario automáticamente en las búsquedas
commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'usuario',
        select: 'nombre email'
    });
    next();
});

module.exports = mongoose.model('Comment', commentSchema);