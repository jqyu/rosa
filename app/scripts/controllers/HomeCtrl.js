angular.module('rosaApp')

.controller('HomeCtrl',
['$scope', '$routeParams', '$location',
function ($scope, $routeParams, $location) {

	if ($location.path().split('/')[1] === 'featured') {
	   	$scope.type = 'featured';
		$scope.query = { type: 'featured' };
		$scope.rootPath = '/featured/';   
	} else {
		$scope.type = 'recent';
		$scope.query = {};
		$scope.rootPath = '/';
	}

	$scope.page = $routeParams.page;

}]);
