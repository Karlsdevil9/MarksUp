const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = express.Router()

router.post('/user/signUp', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    console.log(email)
    console.log(name)
    console.log(password)
    User.findOne({ email: email }).then(user => {
        if (user) {
            res.json({ message: 'teacher With that email already exists please signIn' });
        } else {
            bcrypt.hash(password, 12).then(hassedPassword => {
                const user = new User({
                    name: name,
                    email: email,
                    password: hassedPassword,
                    quiz: { quizes: [] }

                });
                return user.save()
            }).then(result => {
                res.status(201).json({ message: 'User is created!', userId: result._id });
            }).catch(err => {
                console.log(err)
            });

        }
    });

});


router.post('/user/signIn', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadeduser
    User.findOne({ email: email }).then(user => {
        if (!user) {
            res.json({ message: 'User with this does not exists,Please signUp' })
        } else {
            loadeduser = user
            return bcrypt.compare(password, user.password)
        }
    }).then(isEqual => {
        if (!isEqual) {
            res.json({ message: 'Please enter correct password' })
        } else {
            const token = jwt.sign({
                    email: loadeduser.email,
                    teacherId: loadeduser._id.toString(),
                    name: loadeduser.name.toString()
                },
                'somesupersecretsecret', { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: loadeduser._id.toString() });
        }
    })

});




module.exports = router