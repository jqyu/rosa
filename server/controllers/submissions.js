var mongoose = require('mongoose'),
	User = require('../models/user'),
	Submission = require('../models/submission');

module.exports.index = function(req, res, next) {
	var offset = req.query.offset || 0,
		limit = req.query.limit || 10,
		query = {};

	switch(req.query.type) {
		case 'drafts':
			query.state = 0;
			break;
		case 'featured':
			query.state = 2;
			break;
		case 'all':
			query.state = { $gt: -1 };
			break;
		default:
			query.state = { $gt: 0 };
			break;
	}

	if (req.query.userId) {
		query._user = req.query.userId;
	}

	Submission.find(query)
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
	var title = req.body.title,
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
		title: title,
		description: description,
		uploads: uploads
	}

	if (req.body.state === 1) {
		req.payload.state = 1;
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

var changeField = function(cb) {
	return function(req, res, next) {
		Submission.findOne({ _id: req.params.id })
			.then(function(submission) {
					if (cb(submission, req)) {
						submission.save();
					} else {
						return Promise.resolve();
					}
				}, function(err) {
					return Promise.reject(err);
				})
			.then(function (submission) {
					res.sendStatus(200);
				}, function(err) {
					return next(err);
				});
	}
}

// yo dawg i heard you like callbacks
// i'm sorry i just had to do this it was too tempting
module.exports.heart = changeField(
	function (submission, req) {
		var idx = submission.hearts.indexOf(req.user._id);
		if (idx < 0) {
			submission.hearts.push(req.user._id);
			return true;
		}
		return false;
	});

module.exports.unheart = changeField(
	function (submission, req) {
		var idx = submission.hearts.indexOf(req.user._id);
		if (idx > -1) {
			submission.hearts.splice(idx, 1);
			return true;
		}
		return false;
	});

module.exports.feature = changeField(
	function (submission) {
		if (submission.state !== 2) {
			submission.state = 2;
			return true;
		}
		return false;
	});

module.exports.unfeature = changeField(
	function (submission) {
		if (submission.state === 2) {
			submission.state = 1;
			return true;
		}
		return false;
	});
