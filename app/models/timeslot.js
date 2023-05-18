var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('timeslot', new Schema({ 
	time: Number,
	taken: Boolean
}));