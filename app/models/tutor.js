var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timeslot = require('./timeslot');
// set up a mongoose model
module.exports = mongoose.model('Tutor', new Schema({ 
	name: String,
	course: String,
    price: Number,
    slot: timeslot
}));