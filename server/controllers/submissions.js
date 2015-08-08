var mongoose = require('mongoose');

var SubmissionSchema = new mongoose.Schema({
	_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },

	title: String,
	description: String,

	uploads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }]

});

module.exports = mongoose.model('Submission', UploadSchema);
