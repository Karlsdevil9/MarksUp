const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth')
const User = require('../models/teacher')
const student = require('../models/user')
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
                questionList: questionList,
                userlist: []
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

router.post("/del/quiz", isAuth, (req, res, next) => {
    const uniqueCode = req.body.uniqueCode;
    Quiz.findOneAndDelete({ uniqueCode: uniqueCode }).then(result => {
        User.findById(req.userId).then(user => {
            const updatedquiz = user.quiz.quizes.filter(items => {
                return items.quizId.toString() != result._id.toString();
            })
            user.quiz.quizes = updatedquiz;
            return user.save();
        }).then(result => {
            res.json({ "message": "Deleted succesfully" });
        })
    });
})


router.post("/submit/quiz", isAuth, (req, res, next) => {
    const quizId = req.body.quizId;
    var marks = 0;
    var time = 0;


    req.body.questionList.forEach(element => {
        marks += element.point;
    });
    req.body.questionList.forEach(element => {
        time += element.time;
    });
    student.findById(req.userId).then(user => {
        user.quiz.quizes = user.quiz.quizes || [];
        console.log("Rahul----");
        user.quiz.quizes.push({ quizId: quizId, marks: marks, time: time });
        return user.save();
    }).then(result => {
        Quiz.findById(quizId).then(quiz => {
            quiz.userlist = quiz.userlist || [];
            quiz.userlist.push({ userId: req.userId, marks: marks, time: time })
            return quiz.save();
        }).then(_ => { res.json({ "message": "submitted" }); });
    })
})

module.exports = router;