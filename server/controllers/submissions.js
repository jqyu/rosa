var mongoose = require('mongoose'),
	Submission = require('../models/submission');

module.exports.index = function(req, res, next) {
	res.sendStatus(200);
};

module.exports.show = function(req, res, next) {
	Submission.findOne({ _id: req.params.id })
		.populate('uploads _user')
		.then(function(submission) {
				return res.json(submission);
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
