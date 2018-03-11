const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const employerSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contents: [{ type: Schema.Types.ObjectId, ref: 'Content' }]
});

const Employer= mongoose.model('Employer', employerSchema);
module.exports = Employer;