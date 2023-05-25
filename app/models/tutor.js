var mongoose = require('mongoose');
const timeslot = require('./models/timeslot'); // get our mongoose model

var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Tutor', new Schema({ 
	email: String,
	password: String,
    name: String,
    desc: String,
    slot:[timeslot]
}));