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
  let valid_token;
  let std1;

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
      let asdasdas=0;
    });
    let student = await Student.findOne({email: "e1@gmail.com"});
    std1=student;
    //console.log("students found before all: ",student);
    // create a valid token
    let account_type = "student";
    
    // if user is found and password is right create a token
    var payload = {
      email: student.email,
      id: student._id,
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
  
  test('GET /api/v1/students/me with no token should return 401', async () => {
    const response = await request(app).get('/api/v1/students/me');
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/v1/students/me?token=<invalid> should return 403', async () => {
    const response = await request(app).get('/api/v1/students/me?token=123456');
    expect(response.statusCode).toBe(403);
  });
  

      
  test('GET /api/v1/students/me?token=<valid> should return 200', async () => {
  
    const preliminary = await request(app).post('/api/v1/students');
    
    const response = await request(app).get('/api/v1/students/me?token=' + valid_token);
    expect(response.statusCode).toBe(200);
    //done();
  });

  test('GET /api/v1/students/me?token=<valid> should return user information', async () => {
    
    const response = await request(app).get('/api/v1/students/me?token='+valid_token);
    const user = response.body
    expect(user).toBeDefined()
    expect(user.email).toBe('e1@gmail.com');

  });
  test('GET /api/v1/students/{id} <valid> should return email of the first student', async () => {
    
    const response = await request(app).get('/api/v1/students/'+std1._id);
    const user = response.body
    expect(user).toBeDefined()
    expect(user.email).toBe('e1@gmail.com');

  });
  test('GET /api/v1/students/{id} <invalid>', async () => {
    
    const response = await request(app).get('/api/v1/students/64654a');
    const user = response.body
    //expect(user).toBeDefined()
    expect(response.statusCode).toBe(402);

  });
  test('GET /api/v1/students/{id} <valid but for another item>', async () => {
    
    const response = await request(app).get('/api/v1/students/74a817d8f973956b54d2056b');
    const user = response.body
    //expect(user).toBeDefined()
    expect(response.statusCode).toBe(401);

  });
  test('POST /api/v1/students <valid>', async () => {
    const body = {
      email: "e99@gmail.com",
      password: "p99"
    };
    const response = await request(app).post('/api/v1/students').send(body);
    const user = response.body
    //expect(user).toBeDefined()
    expect(response.statusCode).toBe(201);
  });
  test('DELETE /api/v1/students <valid>', async () => {
    let student = await Student.findOne({email: "e99@gmail.com"});
    //console.log("students found before all: ",student);
    // create a valid token
    let account_type = "student";
    
    // if user is found and password is right create a token
    var payload = {
      email: student.email,
      id: student._id,
      type: account_type
      // other data encrypted in the token	
    }
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    tk = jwt.sign(payload, process.env.SUPER_SECRET, options);
    const body = {
      token: tk
    };
    const response = await request(app).delete('/api/v1/students/me').send(body);
    const user = response.body
    //expect(user).toBeDefined()
    expect(response.statusCode).toBe(200);
  });

  test('POST /api/v1/students <invalid>', async () => {
    const body = {
      email: "e99",
      password: "p99"
    };
    const response = await request(app).post('/api/v1/students').send(body);
    const user = response.body
    //expect(user).toBeDefined()
    expect(response.statusCode).toBe(400);
  });

  test('POST /api/v1/students <already existing>', async () => {
    const body = {
      email: "e1@gmail.com",
      password: "p1"
    };
    const response = await request(app).post('/api/v1/students').send(body);
    const user = response.body
    //expect(user).toBeDefined()
    expect(response.statusCode).toBe(409);

  });


});
