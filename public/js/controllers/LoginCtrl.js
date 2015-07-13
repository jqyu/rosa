angular.module('rosaApp')

.controller('LoginCtrl', function($scope) {
	$scope.activeForm = 'login';
	$scope.changeForm = function(formName) {
		console.log('called toggle to '+formName);
		$scope.activeForm = formName;
	}
	$scope.login = function(form) {
		console.log('login called !!');
	}
});
