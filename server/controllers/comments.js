var mongoose	= require('mongoose'),
	Comment		= require('../models/comment'),
	Submission	= require('../models/submission');

var reject = function(err) {
	return Promse.reject(err);
};

module.exports.index = function(req, res, next) {
	var offset = req.query.offset || 0,
		limit = req.query.limit || 10,
		query = { _parentUser: req.user._id, _user: { $ne: req.user._id } };

	Comment.find(query)
		.sort('-createdAt')
		.skip(offset)
		.limit(limit)
		.populate({ path: '_parent', select: '_user title' })
		.populate('_user')
		.then(function(comments) {
			return res.json(comments);
		}, function(err) {
			return next(err);
		});
};

module.exports.create = function(req, res, next) {

	var comment = new Comment({
		_user: req.user,
		_parent: req.params.id,
		text: req.body.text
	});

	comment.save()
		.then(function() {
				return Submission.findOne({ _id: comment._parent });
			}, reject)
		.then(function(submission) {
				if (!submission) {
					return reject(new Error('Submission not found'));
				}
				submission.comments.push(comment);
				return submission.save()
			}, reject)
		.then(function(submission) {
				res.json(comment);
			}, function(err) {
				comment.remove();
				return next(err);
			});
};

module.exports.update = function(req, res, next) {
	req.comment.text = req.body.text;
	req.comment.updatedAt = Date.now();
	req.comment.save()
		.then(function(comment) {
				return res.json(comment);
			}, function(err) {
				return next(err);
			});
};

module.exports.delete = function(req, res, next) {
	var comment = req.comment;

	Submission.findOne({ _id: comment._parent })
		.then(function(submission) {
				if (submission) {
					var idx = submission.comments.indexOf(comment._id);
					if (idx > -1) {
						submission.comments.splice(idx, 1);
						return submission.save();
					}
				}
				return Promise.resolve();
			}, function(err) {
				return Promise.resolve();
			})
		.then(comment.remove(), reject)
		.then(function (comment) {
				return res.sendStatus(200);	
			}, function(err) {
				return next(err);	
			});
};
