const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../app');
const Student = require('../models/student'); // get our mongoose model
const mongoose = require('mongoose');
const Tutor = require('../models/tutor');


describe('POST /api/v1/authentications', () => {
    let userSpy;
    let connection;
    let db;
    let valid_token;
    let ttr1;
  
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

//valutare la questione dell'id
    /*let user = {
        email: "studente1@gmail.com",
        password: "1234"
    };
    let account_type = "student";
    var payload = {
    email:"studente1@gmail.com",
    _id: 12,
    type: account_type }
    var options = {
    expiresIn: 86400 }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    */
    
    test('[student] return 200 if email and password match with an existing user', async () => {

        const response = await request(app)
        .post('/api/v1/authentications')
        .send({
            email: "e1@gmail.com",
            password: "p1"
    })
        .expect(200);

        //console.log("response1:",response.body)
        console.log("token mio:",student_token)
        console.log("tokrn response:",response.body.token)

        expect(response.body).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(response.body.email).toBeDefined();
        //questione dell'id
        //valutazione risposta incompleta dell'api
        expect(response.body.success).toBe(true);
        expect(response.body.message).toEqual('Enjoy your token!');
        expect(response.body.id).toBeDefined();
        expect(response.body.token).toEqual(student_token);

    });


    test('[student] return 401 if email and password are missing', async () => {
        const response = await request(app)
        .post('/api/v1/authentications')
        .send({})
        .expect(401);
    });


  

    test('[student] return 401 if email is wrong', async () => {
        const response = await request(app)
        .post('/api/v1/authentications')
        .send({email:"asasas@mail.com",password:"p1"})
        .expect(401)
    });

    //corretto ma controllare l'output di errore per tutti
    test('[student] return 401 if password is wrong', async () => {
        const res = await request(app)
        .post('/api/v1/authentications')
        .send({email:"e1@gmail.com",password:"cincilla"})
        .expect(401);
    });
    test('[tutor] return 200 if email and password match with an existing user', async () => {

        const response = await request(app)
        .post('/api/v1/authentications_tutor')
        .send({
            email: "t1@gmail.com",
            password: "p1"
    })
        .expect(200);

        //console.log("response1:",response.body)
        console.log("token mio:",student_token)
        console.log("tokrn response:",response.body.token)

        expect(response.body).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.type).toBeDefined();
        expect(response.body.name).toBeDefined();
        //questione dell'id
        //valutazione risposta incompleta dell'api
        expect(response.body.success).toBe(true);
        expect(response.body.message).toEqual('Enjoy your token!');
        expect(response.body.type).toEqual('tutor');
        expect(response.body.name).toEqual('name 1');
        expect(response.body.id).toBeDefined();
        expect(response.body.token).toEqual(token_tutor);

    });


    test('[tutor] return 401 if email and password are missing', async () => {
        const response = await request(app)
        .post('/api/v1/authentications_tutor')
        .send({})
        .expect(401);
    });


  

    test('[tutor] return 401 if email is wrong', async () => {
        const response = await request(app)
        .post('/api/v1/authentications_tutor')
        .send({email:"asasas@mail.com",password:"p1"})
        .expect(401)
    });

    //corretto ma controllare l'output di errore per tutti
    test('[tutor] return 401 if password is wrong', async () => {
        const res = await request(app)
        .post('/api/v1/authentications_tutor')
        .send({email:"e1@gmail.com",password:"cincilla"})
        .expect(401);
    });


});