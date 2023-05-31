const express = require('express');
const router = express.Router();
const Booklending = require('./models/debug'); // get our mongoose model
const Student = require('./models/student'); // get our mongoose model
const Tutor = require('./models/tutor'); // get our mongoose model
const Book = require('./models/book'); // get our mongoose model
const Course = require('./models/course'); // get our mongoose model
const Prenotation = require('./models/prenotation');


const https = require('https');

function httpsPost(met, {body, ...options}) {
    return new Promise((resolve,reject) => {
        const req = https.request({
            method: met,
            ...options,
        }, resposnse => {
            const chunks = [];
            resposnse.on('data', data => chunks.push(data))
            resposnse.on('end', () => {
                let resBody = Buffer.concat(chunks);
                switch(resposnse.headers['content-type']) {
                    case 'application/json':
                        resBody = JSON.parse(resBody);
                        break;
                }
                resolve(resBody)
            })
        })
        req.on('error',reject);
        if(body) {
            req.write(body);
        }
        req.end();
    })
}

function custom_http(method, custom_data){
    let data =  custom_data.body;

    let req = https.request({
    hostname: 'https://tutor-me.onrender.com',
    port: 10000,
    path: custom_data.path,
    method: method,
    headers: {
        'Content-Length': data.length,
        'Content-type': 'application/json'
    }
    }, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });

        resp.on('end', () => {
            console.log(data);
        });
    });

    req.write(data);
    return req;
}

function custom_http2(method, custom_data){
    let url = "https://tutor-me.onrender.com";
    request({
        url: url,
        method: method,
        json: custom_data.body,
    }, function (error, response, body) {
         if (!error && response.statusCode === 200) {
             console.log(body)
         }
         else {
    
             console.log("error: " + error)
             console.log("response.statusCode: " + response.statusCode)
             console.log("response.statusText: " + response.statusText)
         }
     })
}

  
/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    let booklendings;

    console.log("richiesta di debug con: ",req.body, req.params,req.url);

    if ( req.query.studentId )
        booklendings = await Booklending.find({
            studentId: req.query.studentId
        }).exec();
    
    else
        booklendings = await Booklending.find({}).exec();

    booklendings = booklendings.map( (dbEntry) => {
        return {
            self: '/api/v1/booklendings/' + dbEntry.id,
            student: '/api/v1/students/' + dbEntry.studentId,
            book: '/api/v1/books/' + dbEntry.bookId
        };
    });

    res.status(200).json(booklendings);
});

router.get('/token', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
        console.log("result debug/token: ",req.url,req.body,req.params);
        res.status(200).json({"status":"return from degub/token"});
});

router.get('/reset_students', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
        console.log("resetting users: ",req.url,req.body,req.params);
        let students = await Student.find({});
        console.log(students);

        Student.deleteMany({}).then(function(){
            console.log("Data deleted"); // Success
        }).catch(function(error){
            console.log(error); // Failure
        });

        console.log("users deleted");

        //res.status(200).json(Student);

        let student1 = new Student({
            email: "e1@gmail.com",
            password: "p1",
        });
        let student2 = new Student({
            email: "e2@gmail.com",
            password: "p2",
        });
        let student3 = new Student({
            email: "e3@gmail.com",
            password: "p3",
        });
        let student4 = new Student({
            email: "e4@gmail.com",
            password: "p4",
        });
        await student1.save();
        await student2.save();
        await student3.save();
        await student4.save();

        res.status(200).json({"status":"users resetted"});
});

router.get('/reset_tutors', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
        console.log("resetting users: ",req.url,req.body,req.params);
        let tutors = await Tutor.find({});
        console.log(tutors);

        Tutor.deleteMany({}).then(function(){
            console.log("Data deleted"); // Success
        }).catch(function(error){
            console.log(error); // Failure
        });

        console.log("users deleted");

        //res.status(200).json(Student);

        let tutor1 = new Tutor({
            email: "t1@gmail.com",
            password: "p1",
            name: "name 1",
            desc: "desc 1",
            slot:[1,2,3]
        });
        let tutor2 = new Tutor({
            email: "t2@gmail.com",
            password: "p2",
            name: "name 2",
            desc: "desc 2",
            slot:[3,4,5]
        });
        let tutor3 = new Tutor({
            email: "t3@gmail.com",
            password: "p3",
            name: "name 3",
            desc: "desc 3",
            slot:[2,4,6]
        });
        let tutor4 = new Tutor({
            email: "t4@gmail.com",
            password: "p4",
            name: "name 4",
            desc: "desc 4",
            slot:[1,4,6]
        });
        await tutor1.save();
        await tutor2.save();
        await tutor3.save();
        await tutor4.save();

        res.status(200).json({"status":"tutors resetted"});
});

router.get('/reset_courses', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
        console.log("resetting courses: ",req.url,req.body,req.params);
        let courses = await Course.find({});
        console.log(courses);

        Course.deleteMany({}).then(function(){
            console.log("Data deleted"); // Success
        }).catch(function(error){
            console.log(error); // Failure
        });

        let tutors = await Tutor.find();

        console.log("courses deleted");

        //res.status(200).json(Student);

        let course1 = new Course({
            TutorId: tutors[0].id,
            desc: "corso in materia 1",
            price: 11
        });
        let course2 = new Course({
            TutorId: tutors[1].id,
            desc: "corso in materia 2",
            price: 22
        });        
        let course3 = new Course({
            TutorId: tutors[0].id,
            desc: "corso in materia 3",
            price: 33
        });        
        let course4 = new Course({
            TutorId: tutors[1].id,
            desc: "corso in materia 4",
            price: 44
        });
        await course1.save();
        await course2.save();
        await course3.save();
        await course4.save();

        courses = await Course.find({});
        res.status(200).json(courses);
});

router.get('/reset_prenotations', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
        
    console.log("resetting prenotations: ",req.url,req.body,req.params);
    let prenotations = await Prenotation.find({});
    //console.log(Prenotation);

    Prenotation.deleteMany({}).then(function(){
        console.log("Prenotations deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });

    console.log("courses deleted");



    let courses = await Course.find({});
    let students = await Student.find();
    let dim_c = Object.keys(courses).length
    let dim_s = Object.keys(students).length

    let num = 10;


    console.log("all courses: ",courses);
    console.log("course1: ",courses[0]);
    
    let prenotation_list = [];
    for(let i = 0; i < num; i++){
        let rand1 = Math.floor(Math.random() * dim_c);
        let rand2 = Math.floor(Math.random() * dim_s);
        let rand3 = Math.floor(Math.random() * num);
        let pren = new Prenotation({
            CourseId: courses[rand1].id,
            TutorId: courses[rand1].TutorId,
            StudentId: students[rand2].id,
            timeslot: rand3
        });
        prenotation_list.push(pren);

    }

    for (let i = 0; i < prenotation_list.length; i++) {
        //console.log(scores[i]);
        await prenotation_list[i].save();
    }

    prenotations = await Prenotation.find({});
    res.status(200).json(prenotations);

    //res.status(200).json({});
});

router.get('/tutors', async (req, res) => {
    let tutors;

    tutors = await Tutor.find().exec();

    students = students.map( (entry) => {
        return {
            self: '/api/v1/tutors/' + entry.id,
            email: entry.email,
        }
    });

    res.status(200).json(tutors);
});

router.post('', async (req, res) => {
    let studentUrl = req.body.student;
    let bookUrl = req.body.book;

    if (!studentUrl){
        res.status(400).json({ error: 'Student not specified' });
        return;
    };
    
    if (!bookUrl) {
        res.status(400).json({ error: 'Book not specified' });
        return;
    };
    
    let studentId = studentUrl.substring(studentUrl.lastIndexOf('/') + 1);
    let student = null;
    try {
        student = await Student.findById(studentId);
    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when studentId cannot be casted to mongoose ObjectId")
    }

    if(student == null) {
        res.status(400).json({ error: 'Student does not exist' });
        return;
    };
    
    let bookId = bookUrl.substring(bookUrl.lastIndexOf('/') + 1);
    let book = null;
    try {
        book = await Book.findById(bookId).exec();
    } catch (error) {
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Book"
    }
    
    if(book == null) {
        res.status(400).json({ error: 'Book does not exist' });
        return; 
    };

    if( ( await Booklending.find({bookId: bookId}).exec() ).lenght > 0) {
        res.status(409).json({ error: 'Book already out' });
        return
    }
    
	let booklending = new Booklending({
        studentId: studentId,
        bookId: bookId,
    });
    
	booklending = await booklending.save();
    
    let booklendingId = booklending.id;
    
    res.location("/api/v1/booklendings/" + booklendingId).status(201).send();
});

router.get('/hook', async (req, res) => {
    fetch("https://api.render.com/deploy/srv-chhjmml269v0od74on50?key=AL5xkxjwZYI")
        .then((res) => res.json())
        .then((json) => console.log(json));

        res.status(200).json({from:'/debug/hook'});
});

router.delete('/:id', async (req, res) => {
    let lending = await Booklending.findById(req.params.id).exec();
    if (!lending) {
        res.status(404).send()
        console.log('lending not found')
        return;
    }
    await lending.deleteOne()
    console.log('lending removed')
    res.status(204).send()
});
/*
router.get('/test/student', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    console.log("start testing student: ",req.url,req.body,req.params);

    let students = await Student.find({}).exec();

    let ret = "";
    let student_e="test@gmail.com"
    let student_p="test"

    const tmp1 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p1"
        })
    });
    const tmp2 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e2@gmail.com",
            passowrd: "p2"
        })
    });

    //
    //prendo il token
    //
    //let token=tmp2.token;
    let token="1";

    const test1 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"1@gmail.com",
            passowrd: "p1"
        })
    });
    const test1_2 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:12,
            passowrd: "p1"
        })
    });
    const test1_3 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"1@gmail.com",
            passowrd: 15
        })
    });
    const test2 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"1@gmail.com"
        })
    });
    const test3 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            passowrd: "p1"
        })
    });
    const test4 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p2"
        })
    });
    let s1=students[0].id;
    let s2=students[1].id;
    const test5 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students/`+s1,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p2"
        })
    });
    const test6 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students/me`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p2",
            token: t1
        })
    });
    const test7 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students/me`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p2",
            token: t2
        })
    });
    const test8 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students/me`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p2"
        })
    });
    const test9 = await httpsPost("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students/rewrwerw`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p2",
        })
    });
    const test10 = await httpsPost("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            palceholder: "1"
        })
    });
    const test11 = await httpsPost("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e1@gmail.com"
        })
    });
    const test12 = await httpsPost("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            passowrd: "p2"
        })
    });
    const test13 = await httpsPost("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email: 12,
            passowrd: "p2"
        })
    });
    const test14 = await httpsPost("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e1",
            password: "p1"
        })
    });
    const test15 = await httpsPost("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e5@gmail.com",
            password: "p5"
        })
    });

    ret+="tmp1: " + tmp1+"\n";
    ret+="tmp2: " + tmp2+"\n";
    ret+="test1: " + test1+"\n";
    ret+="test1_2: " + test1_2+"\n";
    ret+="test1_3: " + test1_3+"\n";
    ret+="test2: " + test2+"\n";
    ret+="test3: " + test3+"\n";
    ret+="test4: " + test4+"\n";
    ret+="test5: " + test5+"\n";
    ret+="test6: " + test6+"\n";
    ret+="test7: " + test7+"\n";
    ret+="test8: " + test8+"\n";
    ret+="test9: " + test9+"\n";
    ret+="test10: " + test10+"\n";
    ret+="test11: " + test11+"\n";
    ret+="test12: " + test12+"\n";
    ret+="test13: " + test13+"\n";
    ret+="test14: " + test14+"\n";
    ret+="test15: " + test15+"\n";
    res.status(200).json(ret);
        
});

*/
/*
router.get('/test/auth', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    console.log("start testing authentication: ",req.url,req.body,req.params);

    let ret = "";
    let student_e="test@gmail.com"
    let student_p="test"

    const test0 =  custom_http("GET",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/authentications`,
        body: JSON.stringify({
            placeholder: "1"
        })
    });
    const test1 =  custom_http("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/authentications`,
        body: JSON.stringify({
            placeholder: "1"
        })
    });
    const test2 =  custom_http("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e1@gmail.com"
        })
    });
    const test3 =  custom_http("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"1@gmail.com"
        })
    });
    const test4 =  custom_http("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"1@gmail.com",
            passowrd: "p1"
        })
    });
    const test5 =  custom_http("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p2"
        })
    });
    const test6 =  custom_http("POST",{
        hostname: 'https://tutor-me.onrender.com',
        path: `/api/v1/students`,
        body: JSON.stringify({
            email:"e1@gmail.com",
            passowrd: "p1"
        })
    });
    ret+="test0: " + test0+"\n";
    ret+="test1: " + test1+"\n";
    ret+="test2: " + test2+"\n";
    ret+="test3: " + test3+"\n";
    ret+="test4: " + test4+"\n";
    ret+="test5: " + test5+"\n";
    ret+="test6: " + test6+"\n";
    res.status(200).json(ret);
        
});
*/
router.get('/test/status', async (req, res) => {
    console.log("start testing status: ",req.url,req.body,req.params);

    let ret = "";
    const test0 =  custom_http("GET",{
        hostname: 'http://localhost:8080',
        path: `/api/v1/status`,
        body: JSON.stringify({
            placeholder: "1"
        })
    });
    ret+="test0: " + test0+"\n";
    res.status(200).json(ret);
});

/*
todo students id non existing
new student post already exists
new student senza body
*/
module.exports = router;