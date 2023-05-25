const express = require('express');
const router = express.Router();
const Booklending = require('./models/debug'); // get our mongoose model
const Student = require('./models/student'); // get our mongoose model
const Book = require('./models/book'); // get our mongoose model
const Course = require('./models/course'); // get our mongoose model
const Prenotation = require('./models/prenotation');



  
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

router.get('/reset_users', async (req, res) => {
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
            type: "student"
        });
        let student2 = new Student({
            email: "e2@gmail.com",
            password: "p2",
            type: "student"
        });
        let student3 = new Student({
            email: "e3@gmail.com",
            password: "p3",
            type: "tutor"
        });
        let student4 = new Student({
            email: "e4@gmail.com",
            password: "p4",
            type: "tutor"
        });
        await student1.save();
        await student2.save();
        await student3.save();
        await student4.save();

        res.status(200).json({"status":"users resetted"});
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

        let tutors = await Student.find({type: "tutor"});

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
    let students = await Student.find({type: "student"});
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
    let students;

    students = await Student.find({type:"tutor"}).exec();

    students = students.map( (entry) => {
        return {
            self: '/api/v1/students/' + entry.id,
            email: entry.email,
            type: entry.type
        }
    });

    res.status(200).json(students);
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



module.exports = router;