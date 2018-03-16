// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
// const Schema = mongoose.Schema;

// const contentEmployerSchema = new Schema({
//     location: {
//         type: String,
//         required: true
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     salary: {
//         type: Number,
//         required: true
//     },
//     detail: {
//         description: { 
//             type: String, 
//             require: true 
//         },
//         requirement: { 
//             type: String, 
//             require: true 
//         },
//         benefit: { 
//             type: String, 
//             require: true 
//         }
//     },
//     employer: { type: Schema.Types.ObjectId, ref: 'Employer' }
// });

// const Content= mongoose.model('Content', contentEmployerSchema);
// module.exports = Content;