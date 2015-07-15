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
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);

});
