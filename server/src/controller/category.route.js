const express = require('express');
const categoryRouter = express.Router();

const Category = require('../model/category.model');
const { mustBeUser } = require('./mustBeUser');

categoryRouter.post('/create', (req, res) => {
    Category.addCategory(req.body.name)
    .then(category => res.send({ success: true, category }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

categoryRouter.get('/', (req, res) => {
    Category.getCategory()
    .then(categories => res.send({ success: true, categories }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

categoryRouter.get('/:id', (req, res) => {
    Category.getCategoryById(req.params.id)
    .then(category => res.send({ success: true, category }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

module.exports = { categoryRouter };