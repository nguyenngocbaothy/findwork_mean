const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const Employer = require('../../src/model/employer.model');

describe('Test POST /employer/signin', () => {
    beforeEach('Sign up a employer for test', async () => {
        await Employer.signUp('company@gmail.com', '123', '123abc', '123456789', 'company');
    });

    it('Can sign in with email and password', async () => {
        const employerInfo = { email: 'company@gmail.com', password: '123' };
        const response = await request(app).post('/employer/signin').send(employerInfo);
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
    });

    it('Cannot sign in with wrong email', async () => {
        const employerInfo = { email: 'ax@gmail.com', password: '123' };
        const response = await request(app).post('/employer/signin').send(employerInfo);
        assert.equal(response.status, 404);
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, 'CANNOT_FIND_USER');
    });

    it('Cannot sign in with wrong password', async () => {
        const employerInfo = { email: 'company@gmail.com', password: '1234' };
        const response = await request(app).post('/employer/signin').send(employerInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign in without password', async () => {
        const employerInfo = { email: 'company@gmail.com' };
        const response = await request(app).post('/employer/signin').send(employerInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign in without email', async () => {
        const employerInfo = { };
        const response = await request(app).post('/employer/signin').send(employerInfo);
        assert.equal(response.status, 404);
        assert.equal(response.body.success, false);
    });
});