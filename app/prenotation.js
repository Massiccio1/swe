const express = require('express');
const router = express.Router();
const Booklending = require('./models/booklending'); // get our mongoose model
const Student = require('./models/student'); // get our mongoose model
const Tutor = require('./models/tutor'); // get our mongoose model
const Book = require('./models/book'); // get our mongoose model
const Prenotation = require('./models/prenotation'); // get our mongoose model
const Course = require('./models/course'); // get our mongoose model



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */


router.get('', async (req, res) => {
    let prenotations = await Prenotation.find({
        studentId: req.loggedUser.id
    }).exec();

    console.log("prenotations found: ",prenotations);

    if(!prenotations){
        res.status(200).json({});
        return;
    }
    prenotations = prenotations.map( (dbEntry) => {
        return {
            self: '/api/v1/prenotations/' + dbEntry.id,
            course: '/api/v1/students/' + dbEntry.CourseId,
            tutor: '/api/v1/tutors/' + dbEntry.TutorId,
            student: '/api/v1/students/' + dbEntry.StudentId,
            timeslot: dbEntry.date
        };
    });

    res.status(200).json(prenotations);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let prenotations = await Prenotation.findById(req.params.id);
    // console.log("[from prenotation.js] logged user is: ",req.loggedUser.id, "but request was for: ",prenotations.StudentId )
    if(req.loggedUser.id == prenotations.StudentId || req.loggedUser.id == prenotations.TutorId){
        console.log("[from prenotation.js] token matches request");
        res.status(200).json({
            self: '/api/v1/prenotations/' + prenotations.id,
            course: '/api/v1/students/' + prenotations.CourseId,
            tutor: '/api/v1/students/' + prenotations.TutorId,
            student: '/api/v1/students/' + prenotations.StudentId,
            timeslot: '/api/v1/books/' + prenotations.timeslot
        });
    }else{
        res.status(400).json({ error: 'token doesnt match student or tutor' });
        return;
    }

});


router.post('', async (req, res) => {

    console.log("POST prenotation: ",req.url,req.body,req.params);

    let studentId = req.body.student;
    let courseId = req.body.course;
    let tutorId = req.body.tutor;
    let timeslot = req.body.timeslot;

    if (!studentId){
        res.status(400).json({ error: 'Student id not specified' });
        return;
    };
    
    if (!courseId) {
        res.status(400).json({ error: 'course id not specified' });
        return;
    };
    if (!tutorId) {
        res.status(400).json({ error: 'tutor id not specified' });
        return;
    };
    if (!timeslot) {
        res.status(400).json({ error: 'timeslot not specified' });
        return;
    };

    let course = null;
    try {
        course = await Course.findById(courseId);
    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when course cannot be casted to mongoose ObjectId")
    }

    let student = null;
    try {
        student = await Student.findById(studentId);

    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when student cannot be casted to mongoose ObjectId")
    }

    let tutor = null;
    try {
        tutor = await Tutor.findById(tutorId);

    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
        console.log("This catch CastError when student cannot be casted to mongoose ObjectId")
    }
    
	let prenotation = new Prenotation({
        StudentId: studentId,
        TutorId: tutorId,
        CourseId: courseId,
        timeslot: timeslot
    });
    
	prenotation = await prenotation.save();
    
    let prenotationId = prenotation.id;
    
    res.location("/api/v1/prenotations/" + prenotationId).status(201).send();
});



router.delete('/:id', async (req, res) => {
    let prenotation = await Prenotation.findById(req.params.id).exec();
    if (!prenotation) {
        res.status(404).send()
        console.log('prenotation not found')
        return;
    }
    await prenotation.deleteOne()
    console.log('prenotation removed')
    res.status(204).send()
});

module.exports = router;