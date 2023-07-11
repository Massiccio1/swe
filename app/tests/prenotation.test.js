/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const Student = require('../models/student'); // get our mongoose model
const mongoose = require('mongoose');
const Tutor = require('../models/tutor');

describe('GET /api/v1/prenotations',() => {

    var std1;
    var student_token;
    var token_tutor;
    var tut1;
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
         let account_type_st = "student";
        

        var payload_t = {
            email:tut1.email,
            id:tut1._id,
            type:account_type
        }

         var payload_s = {
           email: student.email,
          id: student._id,
          type: account_type_st
         }
        var options = {
          expiresIn: 86400 // expires in 24 hours
        }
      student_token = jwt.sign(payload_s, process.env.SUPER_SECRET, options);
      token_tutor = jwt.sign(payload_t,process.env.SUPER_SECRET,options);
      });
    
      afterAll(async () => {
        await mongoose.connection.close();
      });
            test('get /prenotations should return 200',async () => {
                return await request(app)
               .get('/api/v1/prenotations?token=' + student_token)
               .expect('Content-Type', /json/)
               .expect(200)
               .then((res) => {
                if(res.body && res.body[0] && res.body[1]){
                    console.log(res.body[0]);
                };
               });
                    });

            test('try with wrong token',async () => {
                return await request(app)
                .get('/api/v1/prenotations/?token=1234')
                .expect(403);
                
            });

            test('try with missing token',async () => {
                return await request(app)
                .get('/api/v1/prenotations/?token=')
                .expect(401);
            });
 
});

// describe('test get when there are no prenotations', () => {

//     let student = {
//         _id: "123",
//         studentId: "123",
//         email: "calogero@libero.com",
//         password: "chill"
//     };

//     var account_type = "student";
//     var payload = {
//         _id: student._id,
//         email: student.email,
//         type: account_type
//     }
//     var token = jwt.sign(payload,process.env.SUPER_SECRET);

//     test("if prenotations are empty", async () => {
//         const res = await request(app)
//         .get('/api/v1/prenotations/?token=' + token)
//         .expect('Content-Type',/json/)
//         .expect(200);
//     });



// });

    
