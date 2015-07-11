var mongoose = require('mongoose');

module.exports = mongoose.model('Test', {
	name : { type : String, default: '' }
});
