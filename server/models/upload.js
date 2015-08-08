var mongoose = require('mongoose');

var UploadSchema = new mongoose.Schema({
	mimetype: String,
	path: String,
	size: Number,
	userId: mongoose.Schema.Types.ObjectId 
});

module.exports = mongoose.model('Upload', UploadSchema);
