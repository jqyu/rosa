angular.module('rosaApp')

.factory('Auth', function Auth($location, $rootScope, $http, $resource, $cookieStore) {

	// fetch auth session from cookie
	$rootScope.currentUser = $cookieStore.get('user') || null;
	$cookieStore.remove('user');

	// create session adapter
	var Session = $resource('/auth/session');

	return {

		login: function(provider, userInfo, callback) {
			var cb = callback || angular.noop;
			Session.save({
				provider: provider,
				username: userInfo.username,
				password: userInfo.password
			}, function(user) {
				$rootScope.currentUser = user;
				return cb();
			}, cb);
		},

		logout: function(callback) {
			var cb = callback || angular.noop;
			Session.delete(function (res) {
				$rootScope.currentUser = null;
				return cb();
			}, cb);
		},

		createUser: function(userInfo, callback) {
			var cb = callback || angular.noop;
			$http.post('/auth/users', userInfo)
				.success(function(user) {
					$rootScope.currentUser = user;
					return cb();
				})
				.error(cb);
		},
		
		refreshSession: function() {
			Session.get(function(user) {
				$rootScope.currentUser = user;
			});
		}	
	};
});
