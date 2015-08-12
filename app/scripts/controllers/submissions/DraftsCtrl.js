angular.module('rosaApp')

.controller('DraftsCtrl',
['$scope', '$routeParams', '$location',
function ($scope, $routeParams, $location) {

	if (!$scope.currentUser) {
		$location.path('/login/');
	}

	$scope.page = $routeParams.page;

}]);
