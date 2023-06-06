const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');

describe('GET /api/v1/prenotations',() => {

    let student = {
        _id: "123",
        studentId: "123",
        email: "calogero@libero.com",
        password: "chill"
    };

    var account_type = "student";
    var payload = {
        _id: student._id,
        email: student.email,
        type: account_type
    }
    var token = jwt.sign(payload,process.env.SUPER_SECRET);

    let Prenotation = require('../models/prenotation')
        let prenotationSpy;
        beforeAll( () => {
            prenotationSpy = jest.spyOn(Prenotation,'find').mockImplementation((criterias) => {
                return [{CourseId: "46",
                    TutorId: "11",
                    StudentId: "123",
                    timeslot: 2023},{CourseId: "48",
                        TutorId: "13",
                        StudentId: "123",
                        timeslot: 2023}
                    ];
                    })
            });

            test('get /prenotations should return 200',async () => {
                return await request(app)
               .get('/api/v1/prenotations/?token=' + token)
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

describe('test get when there are no prenotations', () => {

    let student = {
        _id: "123",
        studentId: "123",
        email: "calogero@libero.com",
        password: "chill"
    };

    var account_type = "student";
    var payload = {
        _id: student._id,
        email: student.email,
        type: account_type
    }
    var token = jwt.sign(payload,process.env.SUPER_SECRET);

    test("if prenotations are empty", async () => {
        const res = await request(app)
        .get('/api/v1/prenotations/?token=' + token)
        .expect('Content-Type',/json/)
        .expect(200);
    });



});

//dobbiamo implementare i test solo a livello di unity test?


    
