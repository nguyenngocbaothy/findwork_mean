const mongoose = require('mongoose');

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/findwork-test';
    // if (process.env.NODE_ENV === 'local') return 'mongodb://localhost/mean1812';
    return 'mongodb://localhost/findwork';
}
mongoose.connect(getDatabaseUri());