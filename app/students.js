const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model
const Prenotation = require('./models/prenotation'); // get our mongoose model
const Admin = require('./models/admin')


router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let student = await Student.findOne({email: req.loggedUser.email});
    let prenotations = await Prenotation.find({StudentId: req.loggedUser.id});

    res.status(200).json({
        self: '/api/v1/students/' + student.id,
        email: student.email,
        prenotations: prenotations
    });
});

router.get('', async (req, res) => {
    let students;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        students = await Student.find({email: req.query.email}).exec();
    else
        students = await Student.find().exec();

    students = students.map( (entry) => {
        return {
            self: '/api/v1/students/' + entry.id,
            email: entry.email,
        }
    });

    res.status(200).json(students);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let student = await Student.findById(req.params.id);
    console.log("searched for student id: ", req.params.id);
    res.status(200).json({
        self: '/api/v1/students/' + student.id,
        email: student.email,
    });
});

router.post('', async (req, res) => {

    console.log("request to new student with: ",req.body, req.params,req.url);
    console.log("email: ",req.body.email);
    console.log("password: ",req.body.password);

    if(!req.body.email){ 
        res.status(401).send('no email in body');
        return;
    }
    if(!req.body.password){ 
        res.status(401).send('no password in body');
        return;
    }
    


    let student = await Student.findOne({email: req.body.email}).exec();
    if (student) {
        res.status(409).send()
        console.log('student with the same email already exists')
        return;
    }
    console.log("students with same email found: ",student);

    let new_student = new Student({
        email: req.body.email,
        password: req.body.password
    });

    console.log("about to create student: ",new_student)

    if (!new_student.email || typeof new_student.email != 'string' || !checkIfEmailInString(new_student.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    console.log("creating with email: ",new_student.email," password: ",new_student.password);
    
	new_student = await new_student.save();

    console.log("created: ", new_student);
    
    let studentId = new_student.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/students/" + studentId).status(201).json({
        self: '/api/v1/students/' + studentId,
        email: student.email
    }).send();
});



// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

router.post('/ban', async(req, res)=>{
    if(!req.body.loggedUser){ 
        res.status(401).send('Unauthorized');
        return;
    }

    let admin = await Admin.findOne({email: req.body.loggedUser.email});
    if(!admin){
        res.status(403).send('Forbidden');
        return; 
    }

    let student = await Student.findOne({name: req.body.email}).exec();

    if (!student) {
        res.status(404).send()
        console.log('student not found')
        return;
    }

    student.updateOne({email: req.body.email}, {isBanned:true})
})


module.exports = router;
