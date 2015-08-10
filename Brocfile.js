var compileSass = require('broccoli-sass'),
	concat = require('broccoli-concat'),
	mergeTrees = require('broccoli-merge-trees'),
	uglifyJs = require('broccoli-uglify-js');

var app = 'app';

var styles = compileSass([app], 'styles/app.scss', '/assets/app.css');

var scripts = concat(app, {
	inputFiles: ['scripts/**/*.js'],
	outputFile: '/assets/app.js'
});

scripts = uglifyJs(scripts);

module.exports = mergeTrees(['public', styles, scripts]);
