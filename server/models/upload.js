var mongoose = require('mongoose');

var UploadSchema = new mongoose.Schema({
	_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	mimetype: String,
	path: String,
	size: Number
});

module.exports = mongoose.model('Upload', UploadSchema);
