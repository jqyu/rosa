angular.module('rosaApp')

.controller('HomeCtrl',
['$scope', '$routeParams', '$location',
function ($scope, $routeParams, $location) {

	$scope.type = $location.path().split('/')[1];

	switch ($scope.type) {
		case 'recent':
			$scope.rootPath = '/recent';
			$scope.query = null;
			break;
		case 'drafts':
			$scope.rootPath = '/drafts';
			if (!$scope.currentUser) {
				$location.path('/login');
			} else {
				$scope.query = { type: 'drafts', userId: $scope.currentUser._id };
			}
			break;
		default:
			$scope.type = 'featured';
			$scope.rootPath = '/';
			$scope.query = { type: 'featured' };
			break;
	}

	$scope.page = $routeParams.page;

}]);
