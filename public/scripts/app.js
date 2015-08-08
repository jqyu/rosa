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
			templateUrl: 'views/partials/home.html'
		})
	
		// login form
		.when('/auth/:activeForm', {
			templateUrl: 'views/partials/auth.html',
			controller: 'AuthCtrl'
		})
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
		
		// TODO: 404
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);

});
