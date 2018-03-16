const mongoose = require('mongoose');

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/findwork-test';
    // if (process.env.NODE_ENV === 'local') return 'mongodb://localhost/mean1812';
    return 'mongodb://localhost/findwork';
}

// console.log(typeof process.env.NODE_ENV);
// console.log(typeof 'test');
//console.log(process.env.NODE_ENV);
// console.log(process.env.NODE_ENV === 'test');
//console.log(getDatabaseUri());
mongoose.connect(getDatabaseUri(), { useMongoClient: true });