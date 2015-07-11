// modules
var path = require('path');

// controllers
var Test = require('./models/test');

module.exports = function(app) {

	// server routes ================================
	// handles api calls and authentication routes

	app.get('/api/test', function(req, res) {
		Test.find(function(err, tests) {
			if (err)
				res.send(err);
			res.json(tests);
		});
	});	

	app.get('/api/test-post', function(req, res) {
		var test = Test({ name: 'this is my test !!' });
		test.save(function (err) {
			if (err)
				console.log('you fuckin shit');
			console.log('woop woop woop !!!');
		});
		res.send(200);
	});


	// frontend routes ==============================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		// load our public/index.html file
		res.sendFile('views/index.html', { root: path.join(__dirname, '../public') });
	});

};
