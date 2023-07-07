const Path = require('path');
let test = 1;
const express = require('express');
const app = express();
const cors = require('cors')

const authentication = require('./authentication.js');
const authentication_tutor = require('./authentication_tutor.js');
const tokenChecker = require('./tokenChecker.js');

const students = require('./students.js');
const tutors = require('./tutor.js');
const books = require('./books.js');
const booklendings = require('./booklendings.js');
const debug = require('./debug.js');
const course = require('./course.js');
const prenotation = require('./prenotation.js');
const status = require('./status.js');
const cookieParser = require('cookie-parser');


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.static('public'))



/**
 * CORS requests
 */
app.use(cors())

app.use(cookieParser());

// // Add headers before the routes are defined
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });



/**
 * Serve front-end static files
 */
const FRONTEND = process.env.FRONTEND || Path.join( __dirname, '..', 'node_modules', 'easylibvue', 'dist' );
app.use('/EasyLibApp/', express.static( FRONTEND ));

// If process.env.FRONTEND folder does not contain index.html then use the one from static
!!!!!!!!!!!//app.use('/', express.static('static')); // expose also this folder


app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

/**
 * Authentication routing and middleware
 */
app.use('/api/v1/authentications', authentication);
app.use('/api/v1/authentications_tutor', authentication_tutor);
app.use('/api/v1/status', status);

// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
app.use('/api/v1/booklendings', tokenChecker);
app.use('/api/v1/students/me', tokenChecker('student'));
app.use('/api/v1/students/ban', tokenChecker);
app.use('/api/v1/tutors/me', tokenChecker('tutor'));
app.use('/api/v1/tutors/me/teaching-material', tokenChecker('tutor'));
app.use('/api/v1/prenotations', tokenChecker);//('student')?
app.use('/students/secure/home/',tokenChecker('student'));
app.use('/tutors/secure/home/',tokenChecker('tutor'));
//app.use('/api/v1/tutors/me/teaching-material/upload',tokenChecker);
//app.use('/api/v1/tutors', tokenChecker);
app.use('/api/v1/course/new', tokenChecker);
app.use('/api/v1/course/delete', tokenChecker);
//app.use('/api/v1/prenotations', tokenChecker); //da aggiungere



/**
 * Resource routing
 */

//app.use('/api/students/signup', students);

app.use('/api/v1/books', books);
app.use('/api/v1/students', students);
app.use('/api/v1/tutors', tutors);
app.use('/api/v1/booklendings', booklendings);
app.use('/api/v1/debug', debug);
app.use('/api/v1/course', course);
app.use('/api/v1/prenotations', prenotation);
//app.use('/api/v1/prenotations_tutor', prenotation_tutor);


app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/about/', (req, res)=>{
    res.render('about')
})

app.get('/login/', (req, res)=>{
    res.render('ChooseLogin')
})

app.get('/students/login/', (req, res)=>{
    res.render('studentLogin')
})

app.get('/tutors/login/', (req, res)=>{
    res.render('tutorLogin')
})

app.get('/signup/', (req, res)=>{
    res.render('signUpChoosing')
})

app.get('/students/secure/bookings', (req,res) => {
    loadBookings();
    res.render('bookings')
})


app.get('/students/signup/', (req, res)=>{
    res.render('studentSignup')
})

app.get('/tutors/signup/', (req, res)=>{
    res.render('tutorSignup')
})

app.get('/students/secure/home/', (req, res)=>{
    res.render('studentHomePage')
})

app.get('/tutors/secure/home/', (req, res)=>{
    res.render('tutorHomePage')
})

app.get('/welcome/', (req, res)=>{
    res.render('welcome')
})

/* Default 404 handler */
app.use((req, res) => {
    console.log(req.url,req.body,req.params);
    res.status(404);
    res.json({ error: 'Not found, default handler',url: req.url });
});


module.exports = app;