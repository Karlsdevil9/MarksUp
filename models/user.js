const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },

    quiz: {
        quizes: [{
            quizId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quiz',
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
    }

});

userSchema.methods.addToQuizlist = function(quizId) {
    console.log(this.quiz.quizes)
    this.quiz.quizes = this.quiz.quizes || [];
    this.quiz.quizes.push({ quizId: quizId });
    console.log(this.quiz.quizes)
    return this.save();
}


module.exports = mongoose.model('User', userSchema)