const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const User = require('../../src/model/user.model');

describe('Test user POST /signup', () => {
    it('Can sign up with full info', async () => {
        const userInfo = {
            email: 'user@gmail.com',
            password: '123',
            name: 'user'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(userInfo);
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.equal(response.body.user.name, 'user');
        assert.equal(response.body.user.email, 'user@gmail.com');
        const users = await User.find({});
        assert.equal(users.length, 1);
        const { email, password, name, phone } = users[0];
        assert.equal(email, 'user@gmail.com');
        assert.equal(name, 'user');
        const same = await compare('123', password);
        assert.equal(same, true);
    });

    it('Cannot sign up without email', async () => {
        const userInfo = {
            password: '123',
            name: 'user'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(userInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign up with existed email', async () => {
        await User.signUp('user@gmail.com', '123', 'Pho');
        const userInfo = {
            email: 'user@gmail.com',
            password: '123',
            name: 'Pho'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(userInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });
});