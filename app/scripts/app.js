angular.module('rosaApp', [
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize'
])

.config(
['$routeProvider', '$locationProvider',
function ($routeProvider, $locationProvider) {

	$routeProvider

		// home page and search
		.when('/', {
			templateUrl: 'views/pages/home.html',
			controller: 'HomeCtrl'
		})
		.when('/page/:page', {
			templateUrl: 'views/pages/home.html',
			controller: 'HomeCtrl'
		})
		.when('/featured', {
			templateUrl: 'views/pages/home.html',
			controller: 'HomeCtrl'
		})
		.when('/featured/page/:page', {
			templateUrl: 'views/pages/home.html',
			controller: 'HomeCtrl'
		})
	
		// login form
		.when('/auth/:activeForm', {
			templateUrl: 'views/pages/auth.html',
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
			templateUrl: 'views/submissions/edit.html',
			controller: 'SubmissionEditCtrl'
		})
		.when('/drafts', {
			templateUrl: 'views/pages/drafts.html',
			controller: 'DraftsCtrl'
		})
		.when('/drafts/page/:page', {
			templateUrl: 'views/pages/drafts.html',
			controller: 'DraftsCtrl'
		})

		// submission
		.when('/submissions/:id', {
			templateUrl: 'views/submissions/show.html',
			controller: 'SubmissionShowCtrl'
		})
		.when('/submissions/:id/edit', {
			templateUrl: 'views/submissions/edit.html',
			controller: 'SubmissionEditCtrl'
		})

		// profile
		.when('/users/:username', {
			templateUrl: 'views/users/show.html',
			controller: 'UsersShowCtrl'
		})
		.when('/users/:username/page/:page', {
			templateUrl: 'views/users/show.html',
			controller: 'UsersShowCtrl'
		})
		.when('/users/:username/edit', {
			templateUrl: 'views/users/edit.html',
			controller: 'UsersEditCtrl'
		})

		// TODO: 404
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);

}])

.run(
['$rootScope', '$location',
function ($rootScope, $location) {

	$rootScope.$on('$routeChangeSuccess', function() {
		ga('send', 'pageview', $location.path());
	});

	$rootScope.imageParams = {
		submissionPreview: '?w=640&h=240&fit=crop&crop=faces',
		submission: '?w=640&fit=max'
	};

}]);
