/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const Student = require('../models/student'); // get our mongoose model
var mongoose    = require('mongoose');

describe('GET /api/v1/students/me', () => {

  // Moking User.findOne method
  let userSpy;

  beforeAll( async () => {
    const User = require('../models/student');
    const Student = require('../models/student'); // get our mongoose model
    // console.log("waiting for render");
    // const response = await request(app).get('/api/v1/status');
    // console.log("render is online");

    userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      return {
        email: 'e1@mail.com'
      };
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
  });
  
  it('GET /api/v1/students/me with no token should return 401', async () => {
    const response = await request(app).get('/api/v1/students/me');
    expect(response.statusCode).toBe(401);
  });

  it('GET /api/v1/students/me?token=<invalid> should return 403', async () => {
    const response = await request(app).get('/api/v1/students/me?token=123456');
    expect(response.statusCode).toBe(403);
  });

  
      
  it('GET /api/v1/students/me?token=<valid> should return 200', async () => {
    //expect.assertions(1);
    //console.log("testing: ", "GET /api/v1/students/me?token=<valid> should return 200");
    //console.log(Student);
    let user = await Student.findOne({
      email: "e1@gmail.com"
    });

    //console.log("student found");
    //console.log(user);

  
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
    console.log("token created");
    var url = '/api/v1/students/me?token='+token;
    console.log("url created: ", url)
    const response = await request(app).get(url);

    console.log("request returned a response");

    expect(response.statusCode).toBe(200);
    //done();
  });

  it('GET /api/v1/students/me?token=<valid> should return user information', async () => {
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
    const response = await request(app).get('/api/v1/students/me?token='+token).catch(function(error){
      console.log("error: ",error); // Failure
    });
    const user_body = response.body;
    console.log("response:",response);
    expect(user_body).toBeDefined();
    expect(user_body.email).toBe('e1@mail.com');
    //done();
    //done();
  });
});
