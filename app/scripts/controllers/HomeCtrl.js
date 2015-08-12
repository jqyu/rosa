angular.module('rosaApp')

.controller('HomeCtrl',
['$scope', '$routeParams', '$location',
function ($scope, $routeParams, $location) {

	$scope.type = $location.path().split('/')[1];

	switch ($scope.type) {
		case 'featured':
			$scope.rootPath = '/featured/';
			$scope.query = { type: 'featured' };
			break;
		default:
			$scope.type = 'recent';
			$scope.rootPath = '/';
			$scope.query = null;
			break;
	}

	$scope.page = $routeParams.page;

}]);
