angular.module('rosaApp')

.controller('ChatCtrl', function($rootScope, $scope, Auth) {

	var socketUrl = 'http://localhost:8080/chat';

	$scope.open = false;
	$scope.socket = io.connect(socketUrl, {
		autoConnect: false
	});

	$scope.toggleOpen = function() {
		$scope.open = $scope.open ? false : true;
		if($scope.open) {
			$scope.socket.connect();
		} else {
			$scope.socket.disconnect();
		}
	};

	// reconnect if session changes
	
	$rootScope.$on('currentUser:changed', function() {
		if($scope.open) {
			$scope.socket.disconnect();
			$scope.socket.connect(socketUrl);
		}
	});

	$scope.socket.on('connect', function() {
		console.log('i connected !!!');
	});

	$scope.socket.on('disconnect', function() {
		console.log('i disconnected !!!');
	});

	$scope.socket.on('session connected', function(session) {
		console.log('connected:', session);
	});

	$scope.socket.on('session disconnected', function(session) {
		console.log('disconnected:', session);
	});

	$scope.socket.on('initial payload', function(payload) {
		console.log('payload received:', payload);
	});

	$scope.socket.on('message', function(message) {
		console.log(message);
	});

});

