angular.module('rosaApp')

.controller('NavCtrl', function($scope, Auth, $location) {

	$scope.logout = function() {
		Auth.logout(function(err) {
			if (err) {
				$location.path('/login');
			}
		});
	};
});
