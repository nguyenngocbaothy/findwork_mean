const router = require('express').Router();
const Content = require('../model/contentEmployer.model');
const contentEmployerController = require('../controller/contentEmployer.controller');

router.post('/', createContentEmployer);

module.exports =  router ;

function createContentEmployer(req, res, next) {
    var newContent = req.body;
   
    if (!newContent.location) {
        next({
            statusCode: 400,
            message: "Location is required"
        })
    } else if (!newContent.title) {
        next({
            statusCode: 400,
            message: "Title is required"
        })
    } else if (!newContent.salary) {
        next({
            statusCode: 400,
            message: "Salary is required"
        })
    } else if (!newContent.detail.description) {
        next({
            statusCode: 400,
            message: "Description is required"
        })
    } else if (!newContent.detail.requirement) {
        next({
            statusCode: 400,
            message: "Job requirement is required"
        })
    } else if (!newContent.detail.benefit) {
        next({
            statusCode: 400,
            message: "Benefit is required"
        })
    } else {
        req.body.employer = '5aa4d883947632297cffe3a9';
        contentEmployerController.createContent(newContent)
            .then(employer => {
                res.json(employer);
            })
            .catch(err => {
                next(err);
            });
    }

}