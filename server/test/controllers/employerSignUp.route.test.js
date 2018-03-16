const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const Employer = require('../../src/model/employer.model');

describe('Test employer POST /signup', () => {
    it('Employer can sign up with full info', async () => {
        const employerInfo = {
            email: 'company100@gmail.com',
            password: '123',
            address: '123abc',
            name: 'company100',
            phone: '123456789'
        };
        const response = await request(app)
        .post('/employer/signup')
        .send(employerInfo);
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        //console.log(response.body);
        assert.equal(response.body.employer.email, 'company100@gmail.com');
        assert.equal(response.body.employer.address, '123abc');
        assert.equal(response.body.employer.name, 'company100');
        assert.equal(response.body.employer.phone, '123456789');
        const employers = await Employer.find({});
        assert.equal(employers.length, 1);
        const { email, password, address, name, phone } = employers[0];
        assert.equal(email, 'company100@gmail.com');
        assert.equal(address, '123abc');
        assert.equal(name, 'company100');
        assert.equal(phone, '123456789');
        const same = await compare('123', password);
        assert.equal(same, true);
    });

    it('Cannot sign up without email', async () => {
        const employerInfo = {
            password: '123',
            address: '123abc',
            name: 'company1',
            phone: '01293818239'
        };
        const response = await request(app)
        .post('/employer/signup')
        .send(employerInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign up without adress', async () => {
        const employerInfo = {
            email: 'company100@gmail.com',
            password: '123',
            name: 'company100',
            phone: '123456789'
        };
        const response = await request(app)
        .post('/employer/signup')
        .send(employerInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign up without name', async () => {
        const employerInfo = {
            password: '123',
            address: '123abc',
            phone: '01293818239'
        };
        const response = await request(app)
        .post('/employer/signup')
        .send(employerInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign up without phone', async () => {
        const employerInfo = {
            password: '123',
            address: '123abc',
            name: 'Pho',
        };
        const response = await request(app)
        .post('/employer/signup')
        .send(employerInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign up with existed email', async () => {
        await Employer.signUp('company100@gmail.com', '123', '123abc', '123456789', 'company100');
        const employerInfo = {
            email: 'company100@gmail.com',
            password: '123',
            address: '123abc',
            name: 'company100',
            phone: '123456789'
        };
        const response = await request(app)
        .post('/employer/signup')
        .send(employerInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });
});