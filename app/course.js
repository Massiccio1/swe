const express = require('express');
const router = express.Router();
//const Booklending = require('./models/booklending'); // get our mongoose model
const Student = require('./models/student'); // get our mongoose model
const Tutor = require('./models/tutor'); // get our mongoose model
//const Book = require('./models/book'); // get our mongoose model
const Course = require('./models/course'); // get our mongoose model



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    let courses;
    console.log("courses: ",req.url,req.body,req.params);


    if ( req.query.studentId )
        courses = await Course.find({
            studentId: req.query.studentId
        }).exec();
    
    else
        courses = await Course.find({}).exec();

    
    // courses = courses.map( (dbEntry) => {
    //     return {
    //         self: '/api/v1/course/' + dbEntry.id,
    //         tutor: '/api/v1/tutors/' + dbEntry.TutorId,
    //         desc: dbEntry.desc,
    //         price: dbEntry.price
    //     };
    // });

    res.status(200).json(courses);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let course = null;
    try {
        course = await Course.findById(req.params.id).exec();
    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when course id cannot be casted to mongoose ObjectId");
        res.status(406).send()
        console.log('id incorrect');
        return;
    }

    if(!course) {
        res.status(402).json({ error: 'Course does not exist' });
        return;
    };

    res.status(200).json({
        self: '/api/v1/course/' + course.id,
        tutor: '/api/v1/students/' + course.TutorId,
        desc: course.desc,
        price: course.price
    });
});

/*router.post('', async (req, res) => {
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

*/

router.get('/subject/:subject', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let courses = null;
    try {
        courses = await Course.find({
            Subject: req.params.subject
        }).exec();
    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when course subject cannot be casted to mongoose ObjectId");
        res.status(406).send()
        console.log('subject incorrect');
        return;
    }

    if(!courses) {
        res.status(402).json({ error: 'Course does not exist' });
        return;
    };

    res.status(200).json({
        courses: courses
    });
});



router.post('/new', async (req, res) => {
    
    console.log("new courses: ",req.url,req.body,req.params);


    let TutorId = req.body.TutorId;
    let desc = req.body.desc;
    let price = req.body.price;

    if(req.loggedUser.id != TutorId){ //tutor A is making a course for tutor B, not good
        res.status(401).json({ error: 'token and course tutor dont match' });
        return;
    }

    if (!TutorId){
        res.status(400).json({ error: 'tutor not specified' });
        return;
    };
    
    if (!desc) {
        res.status(400).json({ error: 'description not specified' });
        return;
    };

    if (!price) {
        res.status(400).json({ error: 'price not specified' });
        return;
    };
    
    let tutor = null;
    try {
        tutor = await Tutor.findById(TutorId);
    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when studentId cannot be casted to mongoose ObjectId")
    }

    if(tutor == null) {
        res.status(402).json({ error: 'Tutor does not exist' });
        return;
    };

    //------------------------------------
    //

    //------------------------------------
    
    
    
	let course   = new Course({
        TutorId: TutorId,
        desc: desc,
        price: price
    });
    
	course = await course.save();
    
    let courseId = course.id;
    
    res.location("/api/v1/course/" + courseId).status(201).json({status: 'course ' + course.id + ' created'}).send();
});

router.delete('/delete/:id', async (req, res) => {

    let courses = null;
    try {
        courses = await Course.findById(req.params.id).exec();
    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when course id cannot be casted to mongoose ObjectId");
        res.status(406).send()
        console.log('id incorrect');
        return;
    }

    if (!courses) {
        res.status(405).send()
        console.log('course doesnt exist');
        return;
    }

    if(req.loggedUser.id != courses.TutorId){ //tutor A is deleting a course for tutor B, not good
        res.status(401).json({ error: 'token and course tutor dont match' });
        return;
    }



    await courses.deleteOne();
    console.log('course ', courses, ' removed');
    res.status(200).json({ status: 'course deleted' });
});


module.exports = router;