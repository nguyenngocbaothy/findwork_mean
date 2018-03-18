const assert = require('assert');
const { compare } = require('bcrypt');
const User = require('../../src/model/user.model');

describe('Test user sign up', () => {
    it('Can sign up with full info', async () => {
        await User.signUp('user1@gmail.com', '123', 'user1');
        const users = await User.find({ });
        assert.equal(users.length, 1);
        const { email, password, name } = users[0];
        assert.equal(email, 'user1@gmail.com');
        assert.equal(name, 'user1');
        const same = await compare('123', password);
        assert.equal(same, true);
    });

    it ('Cannot sign up without email', async () => {
        try {
            await User.signUp('', '123', 'user1');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.code, 'INVALID_SIGN_UP_INFO');
        }
    });

    it('Cannot sign up without password', async () => {
        try {
            await User.signUp('', undefined, 'user1');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.code, 'INVALID_PASSWORD');
        }
    });

    it ('Cannot sign up with existed email', async () => {
        await User.signUp('user1@gmail.com', '123', 'user1');
        try {
            await User.signUp('user1@gmail.com', '123', 'user1');
            throw new Error('Wrong');
        } catch (error) {
            assert.equal(error.code, 'EMAIL_EXISTED');
        }
    });
});

describe('Test user sign in', () => {
    beforeEach('Sign up a user for test', async () => {
        await User.signUp('user1@gmail.com', '123', 'user1');
    });

    it('Can sign in with email and password', async () => {
        const user = await User.signIn('user1@gmail.com', '123');
        assert.equal(user.name, 'user1');
        assert.equal(user.email, 'user1@gmail.com');
    });

    it('Cannot sign in with wrong email', async () => {
        try {
            await User.signIn('abcd@gmail.com', '123');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Cannot find user.');
        }
    });

    it('Cannot sign in with wrong password', async () => {
        try {
            await User.signIn('user1@gmail.com', '321');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Invalid password.');
        }
    });

    it('Cannot sign in without password', async () => {
        try {
            await User.signIn('user1@gmail.com', undefined);
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Invalid password.');
        }
    });
});