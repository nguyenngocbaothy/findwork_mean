const Employer = require('../src/model/employer.model');
const User = require('../src/model/user.model');

require('../src/startDatabase');

beforeEach('Remove all data before each test', async () => {
    await Employer.remove();
    await User.remove();
});