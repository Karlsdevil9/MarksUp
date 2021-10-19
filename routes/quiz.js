const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth')
const User = require('../models/teacher')
const Quiz = require("../models/quiz")


router.post("/quiz/create", isAuth, (req, res, next) => {
    const uniqueCode = req.body.uniqueCode
    const name = req.body.name
    const startTime = req.body.startTime
    const endTime = req.body.endTime
    const totalMarks = req.body.totalMarks
    const questionList = req.body.questionList
    Quiz.findOne({ uniqueCode: uniqueCode }).then(result => {
        if (result) {
            res.json({ message: 'This unique code already exists,please choose different unicode' })
        } else {
            const quiz = new Quiz({
                uniqueCode: uniqueCode,
                name: name,
                startTime: startTime,
                endTime: endTime,
                totalMarks: totalMarks,
                questionList: questionList
            });
            quiz.save().then(result => {

                User.findById(req.userId).then(user => {
                    console.log(user);
                    user.quiz.quizes = user.quiz.quizes || [];
                    console.log("Rahul----");
                    user.quiz.quizes.push({ quizId: result._id });
                    return user.save();

                }).then(result => {
                    res.json({
                        message: 'Quiz created successfully!',
                        quiz: quiz,
                    })
                })

            });
        }
    })

});

router.get("/get/teacher/quizes", isAuth, (req, res, next) => {
    User.findById(req.userId).then(user => {

        user.populate('quiz.quizes.quizId')
            .execPopulate().then(result => {
                res.json({
                    quizes: result.quiz.quizes
                })
            });
    });
});

router.post("/get/quizByUniqueCode", (req, res, next) => {
    const uniqueCode = req.body.uniqueCode;
    Quiz.findOne({ uniqueCode: uniqueCode }).then(result => {
        if (result) {
            res.json({
                quiz: result
            })
        } else {
            res.json({ message: "There is no quiz exits with this uniqueCode" });
        }
    })

});

module.exports = router;