var mongoose = require('mongoose'),
	shortid = require('shortid');

var UploadSchema = new mongoose.Schema({
	_id: { type: String, unique: true, default: shortid.generate },
	_user: { type: String, ref: 'User' },
	_parent: { type: String, ref: 'Submission' },
	createdAt: { type: Date, default: Date.now },
	mimetype: String,
	path: String,
	size: Number
});

module.exports = mongoose.model('Upload', UploadSchema);
