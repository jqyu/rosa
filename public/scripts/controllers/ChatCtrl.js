angular.module('rosaApp')

.controller('ChatCtrl', function($rootScope, $scope, Auth) {

	var socketUrl = 'http://localhost:8080/chat';

	$scope.open = false;
	$scope.socket = new io.connect(socketUrl);

	// reconnect if session changes
	$rootScope.$on('currentUser:changed', function() {
		$scope.socket.disconnect();
		$scope.socket.connect(socketUrl);
	});
	
	$scope.toggleOpen = function() {
		$scope.open = $scope.open ? false : true;
	};
});

