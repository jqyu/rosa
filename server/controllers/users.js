var mongoose		= require('mongoose'),
	User			= require('../models/user');

module.exports.create = function (req, res, next) {

	// correct case
	req.body.username = req.body.username && req.body.username.toLowerCase();

	// create user
	var newUser = new User(req.body)
	newUser.provider = 'local';

	// call save hook
	newUser.save(function(err) {
		if(err) {
			// TODO: handle more error messages
			return res.status(400).json(err);
		}
		req.logIn(newUser, function(err) {
			if (err) return next(err);
			// TODO: replace newUser with newUser.user_info
			return res.json(newUser);
		});
	});
};

module.exports.show = function (req, res, next) {
	var username = req.params.username.toLowerCase();

	User.findOne({ username: username }, function (err, user) {
		if (err) {
			return next(new Error('Failed to load User: ' + username));
		}
		if (user) {
			res.json(user);
		} else {
			res.status(404).send('User not found');
		}
	});
};

module.exports.exists = function (req, res, next) {
	var username = req.params.username.toLowerCase();

	User.findOne({ username: username }, function (err, user) {
		if (err) {
			return next(new Error('Failed to load User: ' + username));
		}
		res.send({ exists: !!user });
	});
};

module.exports.test = function(req, res, next) {
	User.find(function(err, users) {
		if (err) {
			res.send(err);
		}
		res.json(users);
	});
}
