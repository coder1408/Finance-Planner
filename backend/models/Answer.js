const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: Map, of: String, required: true }, // Stores answers as key-value pairs
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);
