module.exports.ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.sendStatus(401);
};

module.exports.ensureMod = function (req, res, next) {
	if (req.isAuthenticated() && req.user.role >= 2) {
		return next();
	}
	res.sendStatus(401);
};

module.exports.modelAuthenticator = function (Model, name, role) {
	if (!role) {
		role = 3;
	}
	return function(req, res, next) {
		Model.findOne({ _id: req.params.id })
			.then(function (model) {
				if (!model) {
					return res.sendStatus(404);
				}
				if (req.user._id !== model._user && req.user.role < role) {
					return res.sendStatus(401);
				}
				req[name] = model;
				return next();
			}, function(err) {
				res.sendStatus(404);
			});
	}
}
