var passport		= require('passport');

// returns current authenticated session
module.exports.session = function (req, res) {
	res.json(req.user);
}

// logs out current authenticated session, returns nothing
module.exports.logout = function (req, res) {
	if (req.user) {
		req.logout();
		res.sendStatus(200);
	} else {
		res.status(400).send("Not logged in");
	}
};

// logs in, requires username and password
module.exports.login = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		var error = err || info;
		if (error) {
			return res.status(400).json(error);
		}
		req.logIn(user, function (err) {
			if (err) {
				return res.send(err);
			}
			res.json(req.user);
		});
	})(req, res, next);
}
