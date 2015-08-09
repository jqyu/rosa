angular.module('rosaApp', [
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize'
])

.config(function ($routeProvider, $locationProvider) {
	
	$routeProvider

		// home page and search
		.when('/', {
			templateUrl: 'views/partials/submissions/index.html',
			controller: 'SubmissionIndexCtrl'
		})
		.when('/page/:page', {
			templateUrl: 'views/partials/submissions/index.html',
			controller: 'SubmissionIndexCtrl'
		})
	
		// login form
		.when('/auth/:activeForm', {
			templateUrl: 'views/partials/auth.html',
			controller: 'AuthCtrl'
		})
		// TODO: implicit redirect ??
		.when('/login', {
			redirectTo: '/auth/login'
		})
		.when('/signup', {
			redirectTo: '/auth/signup'
		})

		// submit form
		.when('/submit', {
			templateUrl: 'views/partials/submissions/edit.html',
			controller: 'SubmissionEditCtrl'
		})

		// submission
		.when('/submissions/:id', {
			templateUrl: 'views/partials/submissions/show.html',
			controller: 'SubmissionShowCtrl'
		})
		.when('/submissions/:id/edit', {
			templateUrl: 'views/partials/submissions/edit.html',
			controller: 'SubmissionEditCtrl'
		})
		
		// TODO: 404
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);

});
