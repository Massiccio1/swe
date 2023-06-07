const app = require('./app/app.js');
const mongoose = require('mongoose');
const express = require('express');

app.use(express.static('public'))
app.set('view engine', 'ejs')

/**
 * https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment#4-listen-on-the-correct-port
 */
const port = process.env.PORT || 8080;


/**
 * Configure mongoose
 */
// mongoose.Promise = global.Promise;

process.env.DB_URL="mongodb://127.0.0.1:27017/TutorMe";


app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});