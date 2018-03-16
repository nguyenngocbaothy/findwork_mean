const express = require('express');
const app = express();
const parser = require('body-parser');
const Employer = require('./model/employer.model');

//const contentEmployerRoute = require('./route/contentEmployer.route');
const { employerRouter } = require('../src/controller/employer.route')


//app.use(parser.urlencoded({ extended: false }));
app.use(parser.json()); 
app.use(express.static('public'));

//app.use('/contentemployer', contentEmployerRoute);
app.use('/employer', employerRouter);


module.exports = app;