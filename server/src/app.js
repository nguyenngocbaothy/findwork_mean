const express = require('express');
const app = express();
const parser = require('body-parser');

const { employerRouter } = require('../src/controller/employer.route')
const { userRouter } = require('../src/controller/user.route')
const { jobRouter } = require('../src/controller/job.route');

//app.use(parser.urlencoded({ extended: false }));
app.use(parser.json()); 
app.use(express.static('public'));

app.use('/employer', employerRouter);
app.use('/user', userRouter);
app.use('/job', jobRouter);


module.exports = app;