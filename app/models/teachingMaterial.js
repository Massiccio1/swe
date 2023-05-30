var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('TeachingMaterial', new Schema({ 
	CourseId: String,
	name: String,
    content: Buffer,
    materialType: {
        type: String,
        enum : ['presentation', 'movie', 'article'],
        default: 'article'
    }
}, { collection : 'TeachingMaterial' }));