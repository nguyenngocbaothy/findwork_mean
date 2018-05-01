const express = require('express');
const categoryRouter = express.Router();

const Category = require('../model/category.model');
const { mustBeUser } = require('./mustBeUser');

categoryRouter.post('/create', (req, res) => {
    Category.addCategory(req.body)
    .then(category => res.send({ success: true, category }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

module.exports = { categoryRouter };