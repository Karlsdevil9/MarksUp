const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth')
const User = require('../models/teacher')
const Quiz = require("../models/quiz")


router.post("/quiz/create", isAuth, (req, res, next) => {

    const name = req.body.name
    const startTime = req.body.startTime
    const endTime = req.body.endTime
    const questionList = req.body.questionList
    const quiz = new Quiz({
        name: name,
        startTime: startTime,
        endTime: endTime,
        questionList: questionList
    });
    quiz.save().then(result => {

        User.findById(req.userId).then(user => {
            console.log(user);
            user.quiz.quizes = user.quiz.quizes || [];
            user.quiz.quizes.push({ quizId: result._id });
            return user.save();

        }).then(result => {
            res.json({
                message: 'Quiz created successfully!',
                quiz: quiz,
            })
        })

    });
});



module.exports = router;