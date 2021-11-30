const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Teacher = require('../models/teacher')

const router = express.Router()

router.post('/teacher/signUp', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    console.log(email)
    console.log(name)
    console.log(password)
    Teacher.findOne({ email: email }).then(teacher => {
        if (teacher) {
            res.json({ message: 'teacher With that email already exists please signIn' });
        } else {
            bcrypt.hash(password, 12).then(hassedPassword => {
                const teacher = new Teacher({
                    name: name,
                    email: email,
                    password: hassedPassword,
                    quiz: { quizes: [] }

                });
                return teacher.save()
            }).then(result => {
                res.status(201).json({ message: 'Teacher is created!', teacherId: result._id });
            }).catch(err => {
                console.log(err)
            });

        }
    });

});


router.post('/teacher/signIn', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadedteacher
    Teacher.findOne({ email: email }).then(teacher => {
        if (!teacher) {
            res.json({ message: 'teacher with this does not exists,Please signUp' })
        } else {
            loadedteacher = teacher
            return bcrypt.compare(password, teacher.password)
        }
    }).then(isEqual => {
        if (!isEqual) {
            res.json({ message: 'Please enter correct password' })
        } else {
            const token = jwt.sign({
                    email: loadedteacher.email,
                    teacherId: loadedteacher._id.toString(),
                    name: loadedteacher.name.toString()
                },
                'somesupersecretsecret', { expiresIn: '5h' }
            );
            res.status(200).json({ token: token, teacherId: loadedteacher._id.toString() });
        }
    })

});




module.exports = router