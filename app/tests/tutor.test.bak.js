const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const { options } = require('../authentication');
const tutor = require('../models/tutor');

describe('GET /api/v1/tutors/me',() => {

let tutorSpy;

beforeAll(() => {
    const Tutor = require ('../models/tutor');
    tutorSpy = jest.spyOn(Tutor, 'findOne').mockImplementation((criterias) => {
        return {
            id: 626,
            email: 'Mario@mail.com',
            password: 'mafd'
        };
    });
});

afterAll(async () => {
    tutorSpy.mockRestore();  
})

test('GET /api/v1/tutors/me with no token', async () => {

    const response = await request(app)
    .get('/api/v1/tutors/me')
    expect(response.statusCode).toBe(401);

});


test('GET /api/v1/tutors/me with wrong token', async () => {

    const response = await request(app)
    .get('/api/v1/tutors/me?token=2234557')
    expect(response.statusCode).toBe(403);

});

var payload = {
    id: 626,
    email: 'Mario@mail.com',
    password: 'mafd'
}
var options = {
    expiresIn: 86400
}

var token = jwt.sign(payload, process.env.SUPER_SECRET, options)

test('GET /api/v1/tutors/me with token', async () => {

    const response = await request(app)
    .get('/api/v1/tutors/me?token='+token)
    expect(response.statusCode).toBe(200);

});
});

describe('/api/v1/tutors', () => {

    let tutorSpy;

beforeAll(() => {

    const Tutor = require('../tutor');
    tutorSpy = jest.spyOn(Tutor,'find').mockImplementation((criterias) => {
        return [{name:'mario'},{name:'luca'}];
    })
});

afterAll(() => {
    tutorSpy.mockRestore();
});

test('GET /api/v1/tutors', () => {



});

});