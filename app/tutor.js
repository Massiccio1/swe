const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model
const Course = require('./models/course'); // get our mongoose model
const Tutor = require('./models/tutor'); // get our mongoose model


router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let tutor = await Tutor.findOne({email: req.loggedUser.email});
    let courses = await Course.find({TutorId: req.loggedUser.id});

    res.status(200).json({
        self: '/api/v1/tutors/' + tutor.id,
        email: tutor.email,
        name: tutor.name,
        desc: tutor.desc,
        courses: courses
    });
});

router.get('', async (req, res) => {
    let tutors;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        tutors = await Tutor.find({email: req.query.email}).exec();
    else
        tutors = await Tutor.find().exec();

    tutors = tutors.map( (entry) => {
        return {
            self: '/api/v1/tutors/' + entry.id,
            email: entry.email, 
            name: entry.nam,
            desc: entry.esc,
            slot: entry.slot
        }
    });

    res.status(200).json(tutors);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let tutor = await Tutors.findById(req.params.id);
    console.log("searched for student id: ", req.params.id);
    res.status(200).json({
        self: '/api/v1/tutors/' + tutor.id,
        email: tutor.email,
        name: tutor.name,
        esc: tutor.desc,
        slot: tutor.slot
    });
});

router.post('', async (req, res) => {
    
	let tutor = new Tutor({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        desc: req.body.desc,
        slot: req.body.slot
    });

    console.log("creating with email: ",tutor.email," password: ",tutor.password, " name: ", tutor.name, " desc: ", tutor.desc, "slots: ", tutor.slot);

    if (!tutor.email || typeof tutor.email != 'string' || !checkIfEmailInString(tutor.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    
	tutor = await tutor.save();
    
    let tutorID = tutor.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/tutors/" + tutorID).status(201).send();
});



// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}



module.exports = router;
