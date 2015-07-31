angular.module('rosaApp')

.factory('Auth', function Auth($location, $rootScope, $http, $resource, $cookieStore) {

	// fetch auth session from cookie
	$rootScope.currentUser = $cookieStore.get('user') || null;
	$cookieStore.remove('user');

	// create session adapter
	var Session = $resource('/auth/session');

	// crate session change observers
	var notify = function() {
			$rootScope.$broadcast('currentUser:changed', $rootScope.currentUser);
		}

	return {

		login: function(provider, userInfo, callback) {
			var cb = callback || angular.noop;
			Session.save({
				provider: provider,
				username: userInfo.username,
				password: userInfo.password
			}, function(user) {
				$rootScope.currentUser = user;
				notify();
				return cb();
			}, cb);
		},

		logout: function(callback) {
			var cb = callback || angular.noop;
			Session.delete(function (res) {
				$rootScope.currentUser = null;
				notify();
				return cb();
			}, cb);
		},

		createUser: function(userInfo, callback) {
			var cb = callback || angular.noop;
			$http.post('/auth/users', userInfo)
				.success(function(user) {
					$rootScope.currentUser = user;
					notify();
					return cb();
				})
				.error(cb);
		},
		
		refreshSession: function() {
			Session.get(function(user) {
				$rootScope.currentUser = user;
				notify();
			});
		}	
	};
});
