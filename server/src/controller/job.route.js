const express = require('express');
const jobRouter = express.Router();

const Job = require('../model/job.model');
const { mustBeUser } = require('./mustBeUser');



jobRouter.get('/:id', (req, res) => {
    const employerId = req.params.id;
    Job.getJobByIdEmployer(employerId)
    .then(newJob => res.send({ success: true, newJob }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

jobRouter.put('/:id', mustBeUser, (req, res) => {
    const jobId = req.params.id;
    const employerId = req.idUser;
    const description = req.body.detail.description;
    const requirement = req.body.detail.requirement;
    const benefit = req.body.detail.benefit;
    const { location, title, salary } = req.body;
    Job.updateJobById(jobId, employerId, location, title, salary, description, requirement, benefit)
    .then(newJob => res.send({ success: true, newJob }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

jobRouter.delete('/:id', mustBeUser, (req, res) => {
    const jobId = req.params.id;
    const employerId = req.idUser;
    Job.deleteJobById(jobId, employerId)
    .then(newJob => res.send({ success: true, newJob }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

jobRouter.post('/search', (req, res) => {
    const { key, cate, loca } = req.body;
    Job.searchJob(key, cate, loca)
    .then(job => res.send({ success: true, job }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

jobRouter.post('/:id', (req, res) => {
    const employerId = req.params.id;
    const description = req.body.detail.description;
    const requirement = req.body.detail.requirement;
    const benefit = req.body.detail.benefit;
    const { location, title, salary, category } = req.body;
    Job.addJob(employerId, location, title, salary, description, requirement, benefit, category)
    .then(newJob => res.send({ success: true, newJob }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

jobRouter.get('/', (req, res) => {
    Job.getAll()
    .then(newJob => res.send({ success: true, newJob }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});


module.exports = { jobRouter };