var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Prenotation', new Schema({ 
	CourseId: String,
	TutorId: String,
	StudentId: String,
	timeslot: Number,
}));