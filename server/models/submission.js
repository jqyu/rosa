var mongoose = require('mongoose'),
	shortid = require('shortid');

var SubmissionSchema = new mongoose.Schema({

	_id: { type: String, unique: true, default: shortid.generate },
	_user: { type: String, ref: 'User' },

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },

	title: String,
	description: String,
	state: Number,

	uploads: [{ type: String, ref: 'Upload' }]
});

SubmissionSchema
	.pre('save', function(next) {
		this.populate('uploads', function(err, submission) {
			if (err) {
				return next(err);
			}
			for (var i = 0; i < submission.uploads.length; i++) {
				var upload = submission.uploads[i];
				// TODO: confirm owner of image
				//   will forgo for now in case of admin editing
				// confirms only one parent per upload
				if (upload._parent) {
					if (upload._parent !== submission._id) {
						return next(new Error('upload already in use'));
					}
				} else {
					// To avoid promise mapping,
					// optimistically assume this works
					// apparently this is needed to avoid a circular reference ??? guess thats the consequence of using shortids
					upload._parent = submission._id;
					upload.save();
				}
				// TODO: delete removed uploads
			}
			next();
		});
	})
	.pre('remove', function(next) {
		this.populate('uploads', function(err, submission) {
			if (err) {
				return next(err);
			}
			// we're going to be pretty optimistic here
			for (var i = 0; i < submission.uploads.length; i++) {
				var upload = submission.uploads[i];
				upload.remove();
			}
			next();
		});
	});

module.exports = mongoose.model('Submission', SubmissionSchema);
