angular.module('rosaApp', [
	'ngRoute'
])
.config(function ($routeProvider, $locationProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: 'views/partials/home.html',
			controller: 'MainCtrl'
		})
		.when('/login', {
			templateUrl: 'views/partials/login.html',
			controller: 'LoginCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);	
});
