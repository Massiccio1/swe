var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('admin', new Schema({ 
	
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }  
      
}));