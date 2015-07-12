angular.module('rosaApp', [
	'ngRoute'
])
.config(function ($routeProvider, $locationProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: 'views/partials/home.html',
			controller: 'MainCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);	
});
