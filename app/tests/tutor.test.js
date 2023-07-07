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
    let ttr1;
  
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
      ttr1=Tutor
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


// test('GET /api/v1/tutors/me with token', async () => {

//     const response = await request(app)
//     .get('/api/v1/tutors/me?token='+ valid_token)
//     .expect(200);

//   });
  
//   test('GET /api/v1/tutors/{id} <valid> should return email of the first tutors', async () => {
    
//     const response = await request(app).get('/api/v1/tutors/'+ttr1._id);
//     const user = response.body
//     expect(user).toBeDefined()
//     expect(user.email).toBe('t1@gmail.com');

//   });

//   test('GET /api/v1/tutors/{id} <invalid>', async () => {
    
//     const response = await request(app).get('/api/v1/tutors/64654a');
//     const user = response.body
//     //expect(user).toBeDefined()
//     expect(response.statusCode).toBe(402);

//   });
//   test('GET /api/v1/tutors/{id} <valid but for another item>', async () => {
    
//     const response = await request(app).get('/api/v1/tutors/74a817d8f973956b54d2056b');
//     const user = response.body
//     //expect(user).toBeDefined()
//     expect(response.statusCode).toBe(401);

//   });
//   test('POST /api/v1/tutors <valid>', async () => {
//     const body = {
//       email: "t99@gmail.com",
//       password: "p99",
//       name: "tutor 99"
//     };
//     const response = await request(app).post('/api/v1/tutors').send(body);
//     const user = response.body
//     //expect(user).toBeDefined()
//     expect(response.statusCode).toBe(201);
//   });
//   test('DELETE /api/v1/tutors <valid>', async () => {
//     let Tutor = await tutor.findOne({email: "t99@gmail.com"});
//     //console.log("students found before all: ",student);
//     // create a valid token
//     let account_type = "tutor";
    
//     // if user is found and password is right create a token
//     var payload = {
//       email: Tutor.email,
//       id: Tutor._id,
//       type: account_type
//       // other data encrypted in the token	
//     }
//     var options = {
//       expiresIn: 86400 // expires in 24 hours
//     }
//     tk = jwt.sign(payload, process.env.SUPER_SECRET, options);
//     const body = {
//       token: tk
//     };
//     const response = await request(app).delete('/api/v1/tutors/me').send(body);
//     const user = response.body
//     //expect(user).toBeDefined()
//     expect(response.statusCode).toBe(200);
//   });

//   test('POST /api/v1/tutors <invalid>', async () => {
//     const body = {
//       email: "e99",
//       password: "p99"
//     };
//     const response = await request(app).post('/api/v1/tutors').send(body);
//     const user = response.body
//     //expect(user).toBeDefined()
//     expect(response.statusCode).toBe(400);
//   });

//   test('POST /api/v1/tutors <already existing>', async () => {
//     const body = {
//       email: "t1@gmail.com",
//       password: "p1"
//     };
//     const response = await request(app).post('/api/v1/tutors').send(body);
//     const user = response.body
//     //expect(user).toBeDefined()
//     expect(response.statusCode).toBe(409);

//   });
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