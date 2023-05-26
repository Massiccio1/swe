var mongoose = require('mongoose');
const timeslot = require('./models/timeslot'); // get our mongoose model

var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Prenotation', new Schema({ 
	CourseId: String,
	TutorId: String,
	StudentId: String,
	date: Number,
}));