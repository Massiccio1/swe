var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Course', new Schema({ 
	Subject: String,
	TutorId: { type: Schema.Types.ObjectId, ref: 'tutor' },
	desc: String,
    price: Number
},{ collection : 'courses' }));