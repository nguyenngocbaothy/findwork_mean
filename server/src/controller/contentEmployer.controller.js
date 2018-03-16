// const Content = require('../model/contentEmployer.model');
// const Employer = require('../model/employer.model');

// module.exports = {
//     createContent: createContent
// }

// function createContent(newContent) {
//     var content = new Content(newContent)
//     return content.save()
//         .then(content => {
//             //console.log(content._id);
//             Employer.findByIdAndUpdate("5aa4d883947632297cffe3a9", { $addToSet: { 'content': content._id } })
//                 .then((employer) => {
//                     //console.log('da luu vao mang employer');
//                     return Promise.resolve(employer);
//                 })
//                 .catch(err => {
//                     //console.log('loi luu vao mang employer');
//                     return Promise.reject(err);
//                 })
//             //return Promise.resolve(content);
//         })
//         .catch(err => {
//             return Promise.reject(err);
//         })
// }