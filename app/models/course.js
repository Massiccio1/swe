var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Course', new Schema({ 
	TutorId: String,
	desc: String,
    price: Number
}));