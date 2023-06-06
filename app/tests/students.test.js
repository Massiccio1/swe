/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const Student = require('../models/student'); // get our mongoose model
<<<<<<< HEAD

=======
const {MongoClient} = require('mongodb');
const mongoose = require("mongoose");

require("dotenv").config();


>>>>>>> 9aba9c946bcc47fdaeb834ca5cfd954cbcf2059b
describe('GET /api/v1/students/me', async () => {

  // Moking User.findOne method
  let userSpy;
  let connection;
  let db;

  beforeAll( async () => {
<<<<<<< HEAD
    const User = require('../models/student');
    const Student = require('../models/student'); // get our mongoose model


    // console.log("waiting for render");
    // const response = await request(app).get('/api/v1/status');
    // console.log("render is online");

    userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      return {
        id: 1212,
        email: 'e1@mail.com'
      };
=======
    // const User = require('../models/student');
    // userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
    //   return {
    //     id: 1212,
    //     email: 'John@mail.com',
    //     password: ''
    //   };
    // });
    await mongoose.connection.close();
    await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then ( () => {
      console.log("Connected to Database")
>>>>>>> 9aba9c946bcc47fdaeb834ca5cfd954cbcf2059b
    });
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
<<<<<<< HEAD

  
      
  test('GET /api/v1/students/me?token=<valid> should return 200', async () => {
    //expect.assertions(1);
    console.log(Student);
    let user = await Student.findOne({
      email: "e1@gmail.com"
    });
  
    let account_type = "student";
    
    // if user is found and password is right create a token
    var payload = {
      email: user.email,
      id: user._id,
      type: account_type
      // other data encrypted in the token	
    }
  
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    const response = await request(app).get('/api/v1/students/me?token='+token);
=======
  
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
      
  test('GET /api/v1/students/me?token=<valid> should return 200', async () => {
    const response = await request(app).get('/api/v1/students/me?token=' + token);
>>>>>>> 9aba9c946bcc47fdaeb834ca5cfd954cbcf2059b
    expect(response.statusCode).toBe(200);
    //done();
  });

  test('GET /api/v1/students/me?token=<valid> should return user information', async () => {
<<<<<<< HEAD
    //expect.assertions(2);
    let user = await Student.findOne({
      email: "e1@gmail.com"
    });
  
  
    let account_type = "student";
    
    // if user is found and password is right create a token
    var payload = {
      email: user.email,
      id: user._id,
      type: account_type
      // other data encrypted in the token	
    }
  
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    const response = await request(app).get('/api/v1/students/me?token='+token);
    const user_body = response.body;
    expect(user_body).toBeDefined();
    expect(user_body.email).toBe('e1@mail.com');
    //done();
    //done();
=======
    
    const response = await request(app).get('/api/v1/students/me?token='+token);
    const user = response.body
    .expect(user).toBeDefined()
    .expect(user.email).toBe('e1@mail.com');
    console.log("recived response body: ", user);

>>>>>>> 9aba9c946bcc47fdaeb834ca5cfd954cbcf2059b
  });
});
