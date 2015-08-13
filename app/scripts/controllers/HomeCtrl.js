angular.module('rosaApp')

.controller('HomeCtrl',
['$scope', '$routeParams', '$location',
function ($scope, $routeParams, $location) {

	if ($location.path().split('/')[1] === 'featured') {
	   	$scope.type = 'featured';
		$scope.query = { type: 'featured' };
		$scope.rootpath = '/featured/';   
	} else {
		$scope.type = 'recent';
		$scope.query = {};
		$scope.rootPath = '/featured/';
	}

	$scope.page = $routeParams.page;

}]);
