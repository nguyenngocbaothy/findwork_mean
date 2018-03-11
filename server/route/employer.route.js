const router = require('express').Router();
const Employer = require('../model/employer.model');
const employerController = require('../controller/employer.controller');

router.post('/', createEmployer);
router.get('/', getEmployer);
router.put('/:id', updateEmployer);
router.delete('/:id', deleteEmployer);

module.exports =  router ;

function createEmployer(req, res, next) {
    var newEmployer = req.body;
   
    if (!newEmployer.email) {
        next({
            statusCode: 400,
            message: "Email is required"
        })
    } else if (!newEmployer.password) {
        next({
            statusCode: 400,
            message: "Password is required"
        })
    } else if (!newEmployer.address) {
        next({
            statusCode: 400,
            message: "Address is required"
        })
    } else if (!newEmployer.phone) {
        next({
            statusCode: 400,
            message: "Phone is required"
        })
    } else if (!newEmployer.name) {
        next({
            statusCode: 400,
            message: "Name requirement is required"
        })
    } else {
        employerController.createEmployer(newEmployer)
            .then(employer => {
                res.json(employer);
            })
            .catch(err => {
                next(err);
            });
    }

}

function getEmployer(req, res, next) {
    employerController.getEmployer()
        .then(employer => {
            res.send(employer);
        })
        .catch(err => {
            next(err);
        })
}

function updateEmployer(req, res, next) {
    var id = req.params.id;
    var newEmployer = req.body;
    //console.log(id, newEmployer);
    employerController.updateEmployer(id, newEmployer)
        .then(employer => {
            res.send(employer);
        })
        .catch(err => {
            next(err);
        })
}

function deleteEmployer(req, res, next) {
    var id = req.params.id;
    employerController.deleteEmployer(id)
        .then(() => {
            res.send('Delete Employer successfully');
        })
        .catch(err => {
            next(err);
        })
}