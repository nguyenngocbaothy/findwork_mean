const express = require('express');
const userRouter = express.Router();
const parser = require('body-parser').json();

const User = require('../model/user.model');
const { mustBeUser } = require('./mustBeUser');

userRouter.post('/signup', parser, (req, res) => {
    const { email, password, phone, name } = req.body;
    User.signUp(email, password, name, phone)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

userRouter.post('/signin', parser, (req, res) => {
    const { email, password } = req.body;
    User.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

userRouter.post('/check', mustBeUser, (req, res) => {
    User.check(req.idUser)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

userRouter.post('/savejob/:id', mustBeUser, (req, res) => {
    User.saveJob(req.idUser, req.params.id)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});


module.exports = { userRouter };