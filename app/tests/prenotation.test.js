/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const Student = require('../models/student'); // get our mongoose model
const mongoose = require('mongoose');
const Tutor = require('../models/tutor');
const Prenotation = require('../models/prenotation');
const Course = require('../models/course');

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

            test('try GET /api/v1/prenotations with wrong token',async () => {
                return await request(app)
                .get('/api/v1/prenotations/?token=1234')
                .expect(403); 
            });

            test('try GET /api/v1/prenotations with missing token',async () => {
                return await request(app)
                .get('/api/v1/prenotations/?token=')
                .expect(401);
            });

            test('try GET /api/v1/prenotations/:id ', async() => {
              let prenotation = await Prenotation.findOne({StudentId:std1._id})
              const response = await request(app)
              .get('/api/v1/prenotations/' + prenotation._id)
              .set('x-access-token', student_token)
              .expect(200)

              expect(response.body).toBeDefined()
            })

            test('try GET /api/v1/prenotations/:id ', async() => {
              const response = await request(app)
              .get('/api/v1/prenotations/21347qwefd24')
              .set('x-access-token', student_token)
              .expect(400)
            })

            test('try POST /api/v1/prenotations', async() => {
              let course1 = await Course.findOne({TutorId: tut1._id})

              const response = await request(app)
              .post('/api/v1/prenotations?token=' + student_token)
              .send({
                student:std1._id,
                course: course1._id,
                tutor:tut1._id,
                timeslot: 4
              })
              .expect(201)
            })

            test('try POST /api/v1/prenotations with wrong token', async() => {
              let course1 = await Course.findOne({TutorId: tut1._id})

              const response = await request(app)
              .post('/api/v1/prenotations?token=233254')
              .send({
                student:std1._id,
                course: course1._id,
                tutor:tut1._id,
                timeslot: 4
              })
              .expect(403)
            })

            test('try POST /api/v1/prenotations with empty body', async() => {
              let course1 = await Course.findOne({TutorId: tut1._id})

              const response = await request(app)
              .post('/api/v1/prenotations?token=' + student_token)
              .send({
              })
              .expect(400)
            })
            
            test('try POST /api/v1/prenotations with wrong data', async() => {
              let course1 = await Course.findOne({TutorId: tut1._id})

              const response = await request(app)
              .post('/api/v1/prenotations?token=' + student_token)
              .send({
                student: 2464,
                course: course1._id,
                tutor:tut1._id,
                timeslot: 4
              })
              .expect(401)
            })

            
            // test('try GET /api/v1/prenotations/tutor/:tutor ', async() => {
            //   const response = await request(app)
             
            //   .get('/api/v1/prenotations/tutor/' + tut1._id + "?token=" + student_token)
            //   //.set('x-access-token', student_token)
            //   .expect(200)


            // })


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

    
