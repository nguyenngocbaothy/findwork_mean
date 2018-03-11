const Employer = require('../model/employer.model');
const { hash, compare } = require('bcrypt');

module.exports = {
    createEmployer: createEmployer,
    getEmployer: getEmployer,
    updateEmployer: updateEmployer,
    deleteEmployer: deleteEmployer
}

function createEmployer(newContent) {
    return Employer.find({ email: newContent.email })
        .then(foundCount => {
            if (foundCount.length > 0) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Email is existed'
                });
            } else {
                // ma hoa password
                hash(newContent.password, 8)
                    .then(encrypted => {
                        //console.log(encrypted);
                        newContent.password = encrypted;
                        var employer = new Employer(newContent)
                        return employer.save()
                            .then(employer => {
                                return Promise.resolve(employer);
                            })
                            .catch(err => {
                                return Promise.reject(err);
                            })
                    })
                    .catch(err => {

                    })
                
            }
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

function getEmployer() {
    return Employer.find({}, { password: 0 })
        .then(employer => {
            return Promise.resolve(employer);
        })
        .catch(err => {
            return Promise.reject(err);
        })
}

function updateEmployer(employerId, newEmployer) {
    return Employer.update({ _id: employerId }, newEmployer)
        .then(raw => {
            return Promise.resolve(newEmployer);
        })
        .catch(err => {
            return Promise.reject(err);
        })
}

function deleteEmployer(employerId) {
    return Employer.findByIdAndRemove({ _id: employerId })
        .then(function (raw) {
            return Promise.resolve();
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}