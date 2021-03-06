angular.module('rosaApp')

.controller('ChatCtrl',
['$rootScope', '$scope',
function($rootScope, $scope) {

	var socketUrl = $scope.config.chatHost;

	$scope.open = false;
	$scope.socket = io.connect(socketUrl, {
		autoConnect: false
	});
	$scope.chat = null;

	$scope.toggleOpen = function() {
		$scope.open = !$scope.open;
		if($scope.open) {
			$scope.socket.connect();
		} else {
			$scope.socket.disconnect();
			$scope.chat = null;
		}
	};

	// chat initializes when payload is received
	$scope.socket.on('initial payload', function(payload) {
		// in case payload needs metadata down the road
		$scope.chat = {
			session: payload.session,
			sessions: payload.sessions,
			messages: payload.messages
		};
		$scope.$digest();
	});

	// HANDLE SESSIONS
	// ==============================

	$scope.sessionsOpen = false;
	$scope.setSessionsOpen = function(sessionsOpen) {
		$scope.sessionsOpen = sessionsOpen;
	}

	$rootScope.$on('currentUser:changed', function() {
		// reconnect if session changes
		if($scope.open) {
			$scope.socket.disconnect();
			$scope.chat = null;
			$scope.socket.connect(socketUrl);
		}
	});

	$scope.socket.on('session connected', function(session) {
		if (!$scope.chat.sessions) {
			// TODO: wait until session is initialized 
			// this can only happen if connected but not initialized
			return;
		}
		$scope.chat.sessions.push(session);
		$scope.$digest();
	});

	$scope.socket.on('session disconnected', function(session) {
		if (!$scope.chat.sessions) {
			// TODO: wait until session is initialized
			return;
		}
		// we must find an index by property equality
		// we cannot search by reference
		var i = 0,
			found = false;
		for ( i in $scope.chat.sessions ) {
			if ( $scope.chat.sessions[i].username === session.username ) {
				found = true;
				break;
			}
		}
		if ( found ) {
			$scope.chat.sessions.splice(i, 1);
			$scope.$digest();
		}
	});

	// HANDLE MESSAGES
	// ==============================
	
	$scope.messageChunks = null;

	var chunk = function(collection, comparator) {
		if (collection.length === 0) {
			return [];
		}
		var chunks = [],
			chunk = [collection[0]],
			head = collection[0];
		for (var i=1, cur=collection[i] ;
				 i<collection.length ;
				 i++, cur=collection[i]) {
			// create new chunk
			if (!comparator(head, cur)) {
				chunks.push(chunk);
				chunk = [];
				head = cur;
			}
			chunk.push(cur);
		}
		// push last chunk
		chunks.push(chunk);
		return chunks;
	};

	$scope.$watchCollection('chat.messages', function(messages) {
		if (!messages) {
			$scope.messageChunks = null;
			return;
		}
		// TODO: chunk by time as well
		$scope.messageChunks = chunk(messages, function(m1, m2) {
			return m1.session.username === m2.session.username;
		});
	});
	
	$scope.addMessage = function(message) {
		if (!$scope.chat.messages) {
			// TODO: wait until session is initialized
			return;
		}
		$scope.chat.messages.push(message);
		var trunc = $scope.chat.messages.length - 100;
		if ( trunc > 0 ) {
			$scope.chat.messages.splice(0, trunc);
		}
	};

	$scope.sendMessage = function(form) {
		if ($scope.open) {
			$scope.socket.send(form.message);
			$scope.addMessage({
				session: $scope.chat.session,
				message: form.message,
				sentAt: Date.now()
			});
			form.message = '';
		}
	};

	$scope.socket.on('message', function(message) {
		if (message) {
			$scope.addMessage(message);
			$scope.$digest();
		}
	});

}]);
