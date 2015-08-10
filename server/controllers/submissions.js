var mongoose = require('mongoose'),
	User = require('../models/user'),
	Submission = require('../models/submission');

module.exports.index = function(req, res, next) {
	var offset = req.query.offset || 0,
		limit = req.query.limit || 10;
	Submission.find({ state: { $gt: 0 } })
		.sort('-createdAt')
		.skip(offset)
		.limit(limit)
		.populate('_user')
		.then(function(submissions) {
			return res.json(submissions);
		}, function(err) {
			return next(err);	
		});
};

module.exports.show = function(req, res, next) {
	var populate = '_user uploads',
		includeComments = req.query.includes && req.query.includes.indexOf('comments') > -1;
	if (includeComments) {
		populate += ' comments';
	}
	Submission.findOne({ _id: req.params.id })
		.populate(populate)
		.then(function(submission) {
				if (!submission) {
					return res.sendStatus(404);
				}
				if (includeComments) {
					// deep populate comment users
					User.populate(submission, 'comments._user', function(err, result) {
						if (err) {
							return res.json(submission);
						}
						return res.json(result);
					});
				} else {
					return res.json(submission);
				}
			}, function(err) {
				return next(err);
			});
};

module.exports.process = function(req, res, next) {
	var state = (req.body.state === 0 || req.body.state === 1) ?
					req.body.state : 0,
		title = req.body.title,
		description = req.body.description
		uploads = [];

	if (!title) {
		return next(new Error('No title'));
	}

	for (var i in req.body.uploads) {
		uploads.push(req.body.uploads[i]);
	}

	if (uploads.length < 1) {
		return next(new Error('No uploads'));
	}

	req.payload = {
		state: state,
		title: title,
		description: description,
		uploads: uploads
	}

	next();

};

module.exports.create = function(req, res, next) {

	var submission = new Submission(req.payload);
	submission._user = req.user;

	submission.save()
		.then(function(submission) {
				return res.json(submission);
			}, function(err) {
				return next(err);
			});

};

module.exports.update = function(req, res, next) {
	
	var submission = req.submission,
		payload = req.payload;

	for (var key in payload) {
		submission[key] = payload[key];
	}
	submission.updatedAt = Date.now();

	submission.save()
		.then(function(submission) {
				return res.json(submission);
			}, function(err) {
				return next(err);
			});
};

module.exports.delete = function(req, res, next) {
	req.submission.remove()
		.then(function () {
				res.sendStatus(200);
			}, function (err) {
				next(err);
			});
};
