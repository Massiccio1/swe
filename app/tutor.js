const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model
const Course = require('./models/course'); // get our mongoose model
const Tutor = require('./models/tutor'); // get our mongoose model
const Prenotation = require('./models/prenotation'); // get our mongoose model
//const { app_features } = require('mongoose/models'); //????
const tutor = require('./models/tutor');
const TeachingMaterial = require('./models/teachingMaterial')
const mongoose = require('mongoose');



//METODI GET
router.get('/me', async (req, res) => {
    
    if(!req.loggedUser) {
        return;
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let tutor = await Tutor.findOne({email: req.loggedUser.email});
    let courses = await Course.find({TutorId: req.loggedUser.id});
    let prenotations = await Prenotation.find({TutorId: req.loggedUser.id});

    if(!tutor){
        res.status(401).json({ error: 'tutor doesnt exists' });
        return;
    }
    tutor[courses]=courses
    tutor[prenotations]=prenotations
    console.log("tutor/me completo: ", tutor);
    res.status(200).json({
        tutor: tutor,
        prenotations: prenotations,
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
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(402).json({ error: 'not a valid id: '+ req.params.id});
        return;
    }
    let tutor = await Tutor.findById(req.params.id);

    if(!tutor){
        res.status(401).json({ error: 'tutor doesnt exists' });
        return;
    }
    console.log("searched for tutor id: ", req.params.id);
    res.status(200).json({
        self: '/api/v1/tutors/' + tutor.id,
        email: tutor.email,
        name: tutor.name,
        esc: tutor.desc,
        slot: tutor.slot
    });
});

//METODI POST
router.post('', async (req, res) => {

    // if(!req.body.email || !req.body.password || !req.body.name || !req.body.desc || !req.body.slot){
    //     res.status(401).json({ success: false, message: 'missing parameters in body' });
    //     return;
    // }

    if(!req.body.email || !req.body.password || !req.body.name){
        res.status(401).json({ success: false, message: 'missing parameters in body' });
        return;
    }

    let check_tutor = await Tutor.findOne({email: req.body.email}).exec();
    if (check_tutor) {
        res.status(409).json({ success: false, message: 'tutor with the same email already exists'})
        console.log('tutor with the same email already exists')
        return;
    }
    
    else{
        let tutor = new Tutor({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            // desc: req.body.desc,
            // slot: req.body.slot
        });
    
        console.log("creating with email: ",tutor.email," password: ",tutor.password, " name: ", tutor.name, " desc: ", tutor.desc, "slots: ", tutor.slot);
    
        if (!tutor.email || typeof tutor.email != 'string' || !checkIfEmailInString(tutor.email)) {
            res.status(400).json({ success: false, message: 'The field "email" must be a non-empty string, in email format' });
            return;
        }
        
        tutor = await tutor.save();
        
        let tutorID = tutor.id;
    
        /**
         * Link to the newly created resource is returned in the Location header
         * https://www.restapitutorial.com/lessons/httpmethods.html
         */
        // res.location("/api/v1/tutors/" + tutorID).status(201).json(tutor).send();
        res.status(201).json({
            success: true,
        });
    }
});

//crea slot in cui sarà disponibile per far prenotare lo studente
router.post('/me/slot',async (req,res) => {
                                            
    let newSlot = req.body.slot;

    console.log("[update slot tutor] got slot: ", newSlot);

    if(!newSlot){
        res.status(400).json({ error: 'no slot in body' });
        return;
    }
    let tutor_check = await Tutor.findOne({email: req.loggedUser.email}).exec();
    console.log("tutor check: ",tutor_check);
    //tutor.updateOne({email: req.loggedUser.email}, {$push: {slot:newSlot}}) //inserisce la data all'interno dell'array di date(slot)
    tutor.updateOne({email: req.loggedUser.email}, {slot:newSlot}) //inserisce la data all'interno dell'array di date(slot)

    .then(() =>{
        res.status(201).json("slot creata con successo").send();
    })
    .catch((err) => {
        console.log("errore: ",err);
        res.status(500).json({err:"errore nella creazione",errcode: err}).send();
    })
    
});

//metodo per la creazione di un corso
router.post('/me/course', async (req,res) =>{

    if(!req.loggedUser){ 
        res.status(401).send('Bisogna autenticarsi');
            return;
    }
    
    try {

        const TutorId = req.loggedUser.id

        let course = new Course({

            TutorId: TutorId,
            desc: req.body.desc,
            price: req.body.price

        })

    course = await course.save();
         res.status(201).json(course);
         
    } catch (error) {
        console.error('Errore durante la creazione del nuovo corso:', error);
        res.status(500).send('Errore del server');
    }
   

});


//METODI DELETE

//Metodo per cancellare una slot
router.delete('/me/slot/:date',async (req,res) =>{

    // if(!req.loggedUser) {return;}

    // const slotToDelete = req.params.date;

    // tutor.deleteOne({email:req.loggedUser.email},{$pull: {slot:slotToDelete}})
    // .then(() => {
    //     res.send("Slot cancellata")
    // })
    // .catch((err) => {
    //     console.error(err);
    //     res.json({error:"Slot non cancellata"});
    // });
    //     //----------------------
    let slotToDelete = req.params.date;

    console.log("[update slot tutor] got slot: ", slotToDelete);

    if(!slotToDelete){
        res.status(400).json({ error: 'no slot in body' });
        return;
    }
    let tutor_check = await Tutor.findOne({email: req.loggedUser.email}).exec();
    if(!tutor_check){
        res.status(401).json({ error: 'tutor doesnt exists' });
        return;
    }
    console.log("tutor check: ",tutor_check);
    //tutor.updateOne({email: req.loggedUser.email}, {$push: {slot:newSlot}}) //inserisce la data all'interno dell'array di date(slot)
    await tutor.updateOne({email:req.loggedUser.email},{$pull: {slot:slotToDelete}}).exec() //inserisce la data all'interno dell'array di date(slot)

    .then(() =>{
        res.status(201).json("correctly removed").send();
    })
    .catch((err) => {
        console.log("errore: ",err);
        res.status(500).json({err:"error in deletion",errcode: err}).send();
    })
    

});



//metodo per cancellare il proprio account
router.delete('/me', function(req, res) {

    if(!req.loggedUser) {return;} //controlla che l'utente sia loggato

    const tutorEmail = req.loggedUser.email; // prende l'email associata alla richiesta

      tutor.deleteOne({ email: tutorEmail }) //cancella il tutor con l'email associata
    .then(() => {
      //res.redirect('/api/v1/authentications_tutor'); //non so se ha senso
      return res.json({ message: 'Tutor eliminato con successo.' });
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

router.get('/me/teaching-material', (req, res) => {
    res.sendFile(__dirname + "/views/teaching-material.html");
});

router.post('/me/teaching-material', async(req, res) => {
    
    if(!req.body.loggedUser){ 
        res.status(401).send('Unauthorized');
        return;
    }

    if(!req.body.courseId) {
        res.status(400).send('Bad request. CourseId is required.');
        return;
    }

        console.log(req.body.courseId);
    const course = await Course.findById(req.body.courseId);
    if(!course) {
        res.status(404).send('Not Found. Provided course does not exist.');
        return;
    }

    try {
        const teachingMaterial = new TeachingMaterial({
            courseId: req.body.courseId,
            name: req.body.name
        });
        
        const savedMaterial = await teachingMaterial.save();
        res.status(201).json(savedMaterial);

    } catch(error) {
        console.error('Error ocurred while uploading a teaching material:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;


