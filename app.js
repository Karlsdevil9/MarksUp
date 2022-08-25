const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express()

const authTeacherRouter = require("./routes/teacherAuth");
const authUserRouter = require("./routes/userAuth");
const quizRouter = require("./routes/quiz");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authTeacherRouter);
app.use(authUserRouter);
app.use(quizRouter);

mongoose.connect(
    'Your MongoDb List', { useNewUrlParser: true, useUnifiedTopology: true }
).then(result => {

    app.listen(process.env.PORT || 3000, () => {
        console.log('started')
    })
}).catch(err => {
    console.log(err);
})