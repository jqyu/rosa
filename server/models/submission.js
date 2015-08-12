var mongoose = require('mongoose'),
	shortid = require('shortid');

var SubmissionSchema = new mongoose.Schema({

	_id: { type: String, unique: true, default: shortid.generate },
	_user: { type: String, ref: 'User' },

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },

	thumbnail: String,
	title: String,
	description: String,
	state: { type: Number, default: 0 },

	uploads: [{ type: String, ref: 'Upload' }],

	comments: [{ type: String, ref: 'Comment' }],
	commentsCount: Number,

	hearts: [{ type: String, ref: 'User' }],
	heartsCount: Number

});

SubmissionSchema
	.pre('save', function(next) {
		this.commentsCount = this.commets ? this.comments.length : 0;
		this.heartsCount = this.hearts ? this.hearts.length : 0;
		if (!this.isModified('uploads')) {
			return next();
		}
		this.populate('uploads', function(err, submission) {
			if (err) {
				return next(err);
			}
			submission.thumbnail = submission.uploads[0].path;
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
		this.populate('uploads comments', function(err, submission) {
			if (err) {
				return next(err);
			}
			// we're going to be pretty optimistic here
			for (var i = 0; i < submission.uploads.length; i++) {
				submission.uploads[i].remove();
			}
			for (var i = 0; i < submission.comments.length; i++) {
				submission.comments[i].remove();
			}
			next();
		});
	});

module.exports = mongoose.model('Submission', SubmissionSchema);
