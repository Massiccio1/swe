const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');



describe('POST /api/v1/authentications', () => {
    const User = require('../models/student')
   beforeAll(() => { let userSpy = jest.spyOn(User,'findOne').mockImplementation(() => {
        return {
            _id: 123,
            email: "studente1@gmail.com",
            password: "1234"
        };
    });
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
    
    test('return 200 if email and password match with an existing user', async () => {

        const response = await request(app)
        .post('/api/v1/authentications')
        .send({
            email: "studente1@gmail.com",
            password: "1234"
    })
        .set('Accept','Application/json')
        .expect('Content-Type',/json/)
        .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(response.body.email).toBeDefined();
        //questione dell'id
        //valutazione risposta incompleta dell'api
        expect(response.body.success).toBe(true);
        expect(response.body.message).toEqual('Enjoy your token!');
        expect(response.body.id).toBeDefined();

    });


    test('return 401 if email and password are missing', async () => {
        const response = await request(app)
        .post('/api/v1/authentications')
        .send({})
        .expect(401);
    });


  

    test('return 401 if email is wrong', async () => {
        const response = await request(app)
        .post('/api/v1/authentications')
        .send({email:"m@mail.com",password:"1234"})
        .expect(401)
    });

    //corretto ma controllare l'output di errore per tutti
    test('return 401 if password is wrong', async () => {
        const res = await request(app)
        .post('/api/v1/authentications')
        .send({email:"studente1@gmail.com",password:"cincilla"})
        .expect(401);
    });


});