const Employer = require('../src/model/employer.model');

require('../src/startDatabase');

beforeEach('Remove all data before each test', async () => {
    await Employer.remove();
});