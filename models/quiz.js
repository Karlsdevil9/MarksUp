const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    startTime: {
        type: String,
        required: true,
        maxlength: 60
    },
    endTime: {
        type: String,
        required: true,
        maxlength: 60
    },

    questionList: []


}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);