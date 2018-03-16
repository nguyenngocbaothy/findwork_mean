const express = require('express');
const employerRouter = express.Router();

const Employer = require('../model/employer.model');
const { mustBeUser } = require('./mustBeUser');

employerRouter.post('/signup', (req, res) => {
    const { email, password, address, phone, name } = req.body;
    Employer.signUp(email, password, address, phone, name)
    .then(employer => res.send({ success: true, employer }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

employerRouter.post('/signin', (req, res) => {
    const { email, password } = req.body;
    Employer.signIn(email, password)
    .then(employer => res.send({ success: true, employer }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

employerRouter.post('/check', mustBeUser, (req, res) => {
    Employer.check(req.idUser)
    .then(employer => res.send({ success: true, employer }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

employerRouter.put('/update', mustBeUser, (req, res) => {
    const { email, password, address, phone, name } = req.body;
    Employer.updateEmployer(req.idUser ,email, password, address, phone, name)
    .then(employer => res.send({ success: true, employer }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

employerRouter.get('/', (req, res) => {
    Employer.getEmployer()
    .then(employers => res.send({ success: true, employers }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

module.exports = { employerRouter };