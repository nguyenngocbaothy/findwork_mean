const express = require('express');
const app = express();
const parser = require('body-parser');

const contentEmployerRoute = require('./route/contentEmployer.route');
const employerRouter = require('./route/employer.route')

var errorHandler = require('./middle-ware/error-handler');

//app.use(parser.urlencoded({ extended: false }));
app.use(parser.json()); 
app.use(express.static('public'));

app.use('/contentemployer', contentEmployerRoute);
app.use('/employer', employerRouter);

app.use(errorHandler.errorHandler());

module.exports = app;