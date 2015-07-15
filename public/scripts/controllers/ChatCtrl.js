angular.module('rosaApp')

.controller('ChatCtrl', function($scope) {
	$scope.open = false;

	$scope.toggleOpen = function() {
		$scope.open = $scope.open ? false : true;
	}
});

