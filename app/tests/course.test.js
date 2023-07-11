/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const Student = require('../models/student'); // get our mongoose model
const mongoose = require('mongoose');
const Tutor = require('../models/tutor')


describe('course tests',() => {
    let std1;
    let tut1;
    beforeAll( async () => {
        await mongoose.connection.close();
        await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then ( () => {
          //console.log("Connected to Database");
          let asdasdas=0;
        });
        let tutor = await Tutor.findOne({email: "t1@gmail.com"});
         let student = await Student.findOne({email: "e1@gmail.com"});
         std1=student;
        tut1 = tutor;
        let account_type = "tutor";
        // let account_type_st = "student";
        

        var payload = {
            email:tut1.email,
            id:tut1._id,
            type:account_type
        }
        // if user is found and password is right create a token
        // var payload_s = {
        //   email: student.email,
        //   id: student._id,
        //   type: account_type_st
        //   // other data encrypted in the token	
        // }
        var options = {
          expiresIn: 86400 // expires in 24 hours
        }
        valid_token = jwt.sign(payload, process.env.SUPER_SECRET, options);
        // token_tutor = jwt.sign(payload_t,process.env.SUPER_SECRET,options);
      });
    
      afterAll(async () => {
        await mongoose.connection.close();
      });


      test('test /api/v1/course git add', async () => {
        const response = await request(app)
        .get('/api/v1/course')
        .expect(200)
        expect(response.body).toBeDefined()
      })
      //non funziona
      // test('test /api/v1/course?studentId= with wrong Studentid', async () => {
      //   const response = await request(app)
      //   .get('/api/v1/course?studentId=2134sxd3')
      //   .expect(406)
      // })

      test('test /api/v1/course?studentId= with no query', async () => {
        const response = await request(app)
        .get('/api/v1/course')
        .expect(200)
      })

      
    // let TutorId = req.body.TutorId;
    // let desc = req.body.desc;
    // let price = req.body.price;
    // let subject = req.body.subject;

      test('POST /api/v1/course/new with empty body', async () => {
        const response = await request(app)
        .post('/api/v1/course/new')
        .set('x-access-token', valid_token)
        .set('Accept', 'application/json')
        .send({
        })
        .expect(401)
      })

      test('POST /api/v1/course/new with empty body', async () => {
        const response = await request(app)
        .post('/api/v1/course/new')
        .set('x-access-token', valid_token)
        .set('Accept', 'application/json')
        .send({
          TutorId: valid_token._id,
          desc: "corso 1",
          price: 24,
          subject: "Biology"
        })
        .expect(401)
      })

      test('GET /api/v1/course/subject:subject with existing subject', async () => {
        const response = await request(app)
        .get('/api/v1/course/subject/Biology')
        
      
        .expect(200)
      })

      test('GET /api/v1/course/subject:subject with wrong subject', async () => {
        const response = await request(app)
        .get('/api/v1/course/subject/marketing')
        
        .expect(406)
      })

















})