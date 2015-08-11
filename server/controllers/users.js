var mongoose		= require('mongoose'),
	User			= require('../models/user');

module.exports.create = function (req, res, next) {

	// correct case
	req.body.username = req.body.username && req.body.username.toLowerCase();

	// create user
	var newUser = new User(req.body)
	newUser.provider = 'local';

	// call save hook
	newUser.save()
		.then(function(user) {
			req.logIn(newUser, function(err) {
				if (err) return next(err);
				return res.json(newUser.info);
			});
		}, function(err) {
			// TODO: handle more error messages
			res.status(400).json(err);
		});
};

module.exports.show = function (req, res, next) {
	var username = req.params.username.toLowerCase();

	User.findOne({ username: username })
		.then(function (user) {
			if (user) {
				res.json(user.info);
			} else {
				res.status(404).send('User not found');
			}
		}, function(err) {
			return next(new Error('Failed to load User: ' + username));
		});
};

module.exports.update = function (req, res, next) {
	var username = req.params.username.toLowerCase();

	if (req.user.username !== username && req.user.role <= 2) {
		return next(new Error('You don\'t have permission to edit this uer'));
	}

	User.findOne({ username: username })
		.then(function (user) {
			user.biography = req.body.biography;
			return user.save();
		}, function (err) {
			return Promise.reject(err);
		})
		.then(function (user) {
			return res.json(user.info);
		}, function (err) {
			return next(err);
		});
};

module.exports.exists = function (req, res, next) {
	var username = req.params.username.toLowerCase();

	User.findOne({ username: username })
		.then(function (user) {
			res.send({ exists: !!user });
		}, function(err) {
			return next(new Error('Failed to load User: ' + username));
		});
};
