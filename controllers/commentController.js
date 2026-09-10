const Comment = require('../models/commentModel');

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().sort('-fecha');
        res.status(200).json({
            status: 'success',
            results: comments.length,
            data: { comments }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const newComment = await Comment.create({
            mensaje: req.body.mensaje,
            usuario: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { comment: newComment }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};