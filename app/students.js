const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model
const Prenotation = require('./models/prenotation'); // get our mongoose model
const Admin = require('./models/admin')
const mongoose = require('mongoose');


router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        res.status(401).json({ error: 'no logged user doesnt exists' }).send();

        return;
    }
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let student = await Student.findOne({email: req.loggedUser.email});
    let prenotations = await Prenotation.find({StudentId: req.loggedUser.id});

    if(!student){
        res.status(401).json({ error: 'student doesnt exists' });
        return;
    }

    res.status(200).json({
        self: '/api/v1/students/' + student.id,
        email: student.email,
        prenotations: prenotations
    });
});

router.get('/me/teaching-material', (req, res) => {
    res.sendFile(__dirname + "/views/teaching-material.html");
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
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(402).json({ error: 'not a valid id: '+ req.params.id});
        return;
    }
    let student = await Student.findById(req.params.id);
    if(!student){
        res.status(401).json({ error: 'student doesnt exists with id: '+ req.params.id});
        return;
    }
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
        res.status(401).json({ success: false, message: 'no email in body'});
        return;
    }
    if(!req.body.password){ 
        res.status(401).json({ success: false, message: 'no password in body'});
        return;
    }
    


    let student = await Student.findOne({email: req.body.email}).exec();
    if (student) {
        res.status(409).json({ success: false, message: 'student with the same email already exists'})
        console.log('student with the same email already exists')
        console.log("students with same email found: ",student);
        return;
    }
    
    else{
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
        // res.location("/api/v1/students/" + studentId).status(201).json({
        //     self: '/api/v1/students/' + new_student.id,
        //     email: new_student.email
        // }).send();
        res.status(201).json({
            success: true,
            // self: '/api/v1/students/' + new_student.id,
            // email: new_student.email
        });
    }
});

router.delete('/me', async (req, res) => {
    if(!req.loggedUser) {return;} //controlla che l'utente sia loggato

    const email = req.loggedUser.email; // prende l'email associata alla richiesta

    Student.deleteOne({ email: email }) //cancella il tutor con l'email associata
    .then(() => {
      //res.redirect('/api/v1/authentications_tutor'); //non so se ha senso
      return res.status(200).json({ message: 'Studente eliminato con successo.' });
    }) //se la cancellazione è andata a buon fine manda un messaggio di conferma
    .catch ((err) => {
      console.error(err);
      return res.status(500).json({ error: 'Errore nell\'eliminazione' });
    })} // se la cancellazione è andata male manda un messaggio di errore
  );



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
