const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');


describe('POST /api/v1/authentications', () => {

    test('return 401 if email or password is missing', async () => {
        const response = await request(app)
        .post('/api/v1/authentications')
        .send({})
        .expect(response.statuscode).toBe(401);
    });

    test('return 401 if email or password is missing', async () => {
        const response = await request(app)
        .post('/api/v1/authentications')
        .send({email: 'luca@gmail.com',password: 'marchetto'});
    });

    test('return 401 if email is wrong', async () => {
        const response = await request(app)
        .post('/api/v1/authentications')
        .send({email:"marino@mail.com"})
        .expect(response.statusCode).toBe(401)
    });

    test('return 401 if password is wrong', async () => {
        const res = await request(app)
        .post('/api/v1/authentications')
        .send({password:"cincilla"})
        .expect(res.statusCode).toBe(401)
    });


    //



});