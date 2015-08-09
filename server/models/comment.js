var mongoose = require('mongoose'),
	shortid = require('shortid');

var CommentSchema = new mongoose.Schema({
	
	_id: { type: String, unique: true, default: shortid.generate },
	_user: { type: String, ref: 'User' },
	_parent: { type: String, ref: 'Submission' },

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },

	text: String

});

CommentSchema
	.pre('save', function(next) {
		if (!this.text) {
			return next(new Error('Blank comment'));
		}
		// possible todo: confirm that parent exists??
		next();
	});

module.exports = mongoose.model('Comment', CommentSchema);
