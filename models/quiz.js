const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    uniqueCode: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    startTime: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    endTime: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    totalMarks: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },

    questionList: [],
    userlist: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            required: true
        },
        time: {
            type: Number,
            required: true
        }
    }]


}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);