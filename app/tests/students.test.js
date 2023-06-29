/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const Student = require('../models/student'); // get our mongoose model
const mongoose = require('mongoose');
describe('GET /api/v1/students/me', () => {

  // Moking User.findOne method
  let userSpy;
  let connection;
  let db;

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
    console.log("mongo: ", process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then ( () => {
      console.log("Connected to Database");

    });
    let students = await Student.find({email: "e1@gmail.com"});
    console.log("students found 1: ",students);
  });

  afterAll(async () => {
    //userSpy.mockRestore();
    //await connection.close();
    await mongoose.connection.close();
  });
  
  test('GET /api/v1/students/me with no token should return 401', async () => {
    const response = await request(app).get('/api/v1/students/me');
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/v1/students/me?token=<invalid> should return 403', async () => {
    const response = await request(app).get('/api/v1/students/me?token=123456');
    expect(response.statusCode).toBe(403);
  });
  

      
  test('GET /api/v1/students/me?token=<valid> should return 200', async () => {
    let students = await Student.find({email: "e1@gmail.com"});
    console.log("students found: ",students);
    // create a valid token
    let account_type = "student";
    
    // if user is found and password is right create a token
    var payload = {
      email: students.email,
      id: students._id,
      type: account_type
      // other data encrypted in the token	
    }
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    
    const response = await request(app).get('/api/v1/students/me?token=' + token);
    expect(response.statusCode).toBe(200);
    //done();
  });

  test('GET /api/v1/students/me?token=<valid> should return user information', async () => {
    let students = await Student.find({email: "e1@gmail.com"});
    console.log("students found: ",students);
    // create a valid token
    let account_type = "student";
    
    // if user is found and password is right create a token
    var payload = {
      email: students.email,
      id: students._id,
      type: account_type
      // other data encrypted in the token	
    }
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    
    const response = await request(app).get('/api/v1/students/me?token='+token);
    const user = response.body
    expect(user).toBeDefined()
    expect(user.email).toBe('e1@mail.com');
    console.log("recived response body: ", user);

  });
});
