const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const mongoose = require('mongoose');
const { options } = require('../authentication');
const tutor = require('../models/tutor');




describe('GET /api/v1/tutors/me',() => {

    let userSpy;
    let connection;
    let db;
    let valid_token;
  
    beforeAll( async () => {
      // const User = require('../models/student');
      // userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      //   return {
      //     id: 1212,
      //     email: 'John@mail.com',
      //     password: ''
      //   };
      // });
      await mongoose.connection.close();
      //console.log("mongo: ", process.env.DB_URL);
      await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then ( () => {
        //console.log("Connected to Database");
        let eweqweq=0;
      });
      let Tutor = await tutor.findOne({email: "t1@gmail.com"});
      //console.log("students found before all: ",Tutor);
      // create a valid token
      let account_type = "tutor";
      
      // if user is found and password is right create a token
      var payload = {
        email: Tutor.email,
        id: Tutor._id,
        type: account_type
        // other data encrypted in the token	
      }
      var options = {
        expiresIn: 86400 // expires in 24 hours
      }
      valid_token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    });
  
    afterAll(async () => {
      //userSpy.mockRestore();
      //await connection.close();
      await mongoose.connection.close();
    });



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


test('GET /api/v1/tutors/me with token', async () => {

    const response = await request(app)
    .get('/api/v1/tutors/me?token='+ valid_token)
    .expect(200);

});
});

/*describe('/api/v1/tutors', () => {

    let tutorSpy;

before(() => {

    const Tutor = require('../tutor');
    tutorSpy = jest.spyOn(Tutor,'find').mockImplementation((criterias) => {
        return [{name:'mario'},{name:'luca'}];
    })
});

after(() => {
    tutorSpy.mockRestore();
});

test('GET /api/v1/tutors', () => {



});*/

//});