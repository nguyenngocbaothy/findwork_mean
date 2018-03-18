const assert = require('assert');
const { compare } = require('bcrypt');
const Employer = require('../../src/model/employer.model');

describe('Test employer sign up', () => {
    it('Can sign up with full info', async () => {
        await Employer.signUp('company100@gmail.com', '123', '123abc', '123456789', 'company100');
        const employers = await Employer.find({ });
        assert.equal(employers.length, 1);
        const { email, password, address, name, phone } = employers[0];
        assert.equal(email, 'company100@gmail.com');
        assert.equal(address, '123abc')
        assert.equal(name, 'company100');
        assert.equal(phone, '123456789');
        const same = await compare('123', password);
        assert.equal(same, true);
    });

    it ('Cannot sign up without email', async () => {
        try {
            await Employer.signUp('', '123', '123abc', '123456789', 'company100');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.code, 'INVALID_SIGN_UP_INFO');
        }
    });

    it('Cannot sign up without password', async () => {
        try {
            await Employer.signUp('company100@gmail.com', undefined, '123abc', '123456789', 'company100');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.code, 'INVALID_PASSWORD');
        }
    });

    it ('Cannot sign up with existed email', async () => {
        await Employer.signUp('company100@gmail.com', '123', '123abc', '123456789', 'company100');
        try {
            await Employer.signUp('company100@gmail.com', '123', '123abc', '123456789', 'company100');
            throw new Error('Wrong');
        } catch (error) {
            assert.equal(error.code, 'EMAIL_EXISTED');
        }
    });
});

describe('Test employer sign in', () => {
    beforeEach('Sign up a employer for test', async () => {
        await Employer.signUp('company100@gmail.com', '123', '123abc', '123456789', 'company100');
    });

    it('Can sign in with email and password', async () => {
        const employer = await Employer.signIn('company100@gmail.com', '123');
        assert.equal(employer.email, 'company100@gmail.com');
        assert.equal(employer.address, '123abc');
        assert.equal(employer.phone, '123456789');
        assert.equal(employer.name, 'company100');
    });

    it('Cannot sign in with wrong email', async () => {
        try {
            await Employer.signIn('abcd@gmail.com', '123');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Cannot find user.');
        }
    });

    it('Cannot sign in with wrong password', async () => {
        try {
            await Employer.signIn('company100@gmail.com', '321');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Invalid password.');
        }
    });

    it('Cannot sign in without password', async () => {
        try {
            await Employer.signIn('company100@gmail.com', undefined);
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Invalid password.');
        }
    });
});

describe('Test employer update info', () => {
    let employerId;
    beforeEach('Sign up a employer for test', async () => {
        await Employer.signUp('company100@gmail.com', '123', '123abc', '123456789', 'company100');
        const employer = await Employer.findOne({ email: 'company100@gmail.com'});
        //console.log(employer.password);
        employerId = employer._id;
    });

    it('Can update employer with address', async () => {
        // console.log(employerId);
        await Employer.updateEmployer(employerId, 'company100@gmail.com', '123', '123abc', '123456789', 'company100update');
        const employers = await Employer.find({});
        const { email, password, address, phone, name } =  employers[0];
        assert.equal(name, 'company100update');
    });
});