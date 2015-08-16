var Submission = require('../models/submission'),
	User = require('../models/user');

module.exports = function (req, res, fragment, config) {

	// not loving all the code duplication with the frontend 
	// so TODO: fix all this shit eventually pls
	if (fragment.charAt(0) === '/') {
		fragment = fragment.substring(1);
	}
	var fragments = fragment.split('/');

	// submission
	if (fragments[0] === 'submissions') {
		return Submission.findOne({ _id: fragments[1] })
				.populate('_user')
				.populate('uploads')
				.populate('comments')
				.then(function(submission) {
					if (!submission) {
						return res.sendStatus(404);
					}
					for(var i = 0 ; i < submission.uploads.length ; i++) {
						submission.uploads[i].src = config.hostNames.image + '/' + submission.uploads[i].path;
					}
					User.populate(submission, 'comments._user', function(err, result) {
						res.render('submissions/show', err ? submission : result);
					});
				}, function(err) {
					res.sendStatus(404);
				});
	}

	// profile
	if (fragments[0] === 'users') {
		var user = {};
		var page = fragments[2] === 'page' && parseInt(fragments[3], 10) || 1,
			limit = 12,
			offset = (page-1) * limit;

		return User.findOne({ username: fragments[1] && fragments[1].toLowerCase() })
				.then(function (record) {
					if (!user) {
						return Promise.reject();
					}
					user = record;
					return Submission.find({ _user: record._id, state: { $gt: 0 } })
							.sort('-createdAt')
							.skip(offset)
							.limit(limit);
				}, function(err) {
					return Promise.reject();
				})
				.then(function (results) {
					user.submissions = results;
					user.page = page;
					user.limit = limit;
					if (results[0] && results[0].thumbnail) {
						user.image = config.hostNames.image + '/' + results[0].thumbnail;
					} else {
						user.image = 'http://rosa.wtf';
					};
					res.render('users/show', user);
				}, function (err) {
					res.sendStatus(404);
				});
	}

	// featured and index
	var gt = 0,
		idx = 0,
		title = 'rosa.wtf - recent submissions';
		rootPath = '';
	if (fragments[0] === 'featured') {
		gt = 1;
		idx = 1;
		title = 'rosa.wtf - featured submissions';
		rootPath = '/featured/';
	}
	var page = fragments[idx] === 'page' && parseInt(fragments[idx+1], 10) || 1,
		limit = 12,
		offset = (page-1) * limit;

	Submission.find({ state: { $gt: gt } })
		.sort('-createdAt')
		.skip(offset)
		.limit(limit)
		.populate('_user')
		.then( function (results) {
			var data = {
				title: title,
				image: 'http://rosa.wtf',
				submissions: results,
				page: page,
				limit: limit,
				rootPath: rootPath
			}
			if (results[0] && results[0].thumbnail) {
				data.image = config.hostNames.image + '/' + results[0].thumbnail;
			};
			res.render('submissions/index', data);
		}, function (err) {
			res.sendStatus(404);
		});
};
