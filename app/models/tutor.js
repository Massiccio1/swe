var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Tutor', new Schema({ 
	email: { 
        type: String,
        required: true,
        unique: true
    },
	password: {
        type: String,
        required: true
    },
    name: String,
    desc: String,
    slot: [Number]
}));