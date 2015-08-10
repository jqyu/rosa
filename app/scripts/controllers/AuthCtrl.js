angular.module('rosaApp')

.controller('AuthCtrl',
['$scope', '$routeParams', '$location', '$http', 'Auth',
function($scope, $routeParams, $location, $http, Auth) {

	$scope.activeForm = $routeParams.activeForm;
	// changes form without triggering refresh
	// allows for pretty animations and stuff
	$scope.changeForm = function(formName) {
		$scope.activeForm = formName;
	};
	
	// TODO: simplify this logic with directives
	// handle validations and errors

	$scope.validate = function(form, field, value) {
		if (!form.validations) {
			form.validations = {};
		}
		form.validations[field] = value;
		if (value) {
			if (!form.errors) {
				form.errors = {};
			}
			form.errors[field] = null;
		}
	}
	$scope.error = function(form, field, value) {
		if (!form.errors) {
			form.errors = {};
		}
		form.errors[field] = value;
		if (value) {
			if (!form.validations) {
				form.validations = {};
			}
			form.validations[field] = null;
		}
	}


	// individual form methods
	
	$scope.login = function(form) {
		$scope.isLoggingIn = true;
		$scope.error(form, 'username', form.user.username ? null : 'blank');
		$scope.error(form, 'password', form.user.password ? null : 'blank');
		if (form.errors.username || form.errors.password) {
			return false;
		}
		Auth.login('local', form.user, function(err) {
			if(!err) {
				$location.path('/');
			} else {
				angular.forEach(err.data.errors, function(error, field) {
					$scope.error(form, field, error);
				});
				$scope.loginError = err.data.message;
				$scope.isLoggingIn = false;
			}
		});
	};

	$scope.resetUsernameValidations = function(form) {
		$scope.validate(form, 'username', null);
		$scope.error(form, 'username', null);
	}

	$scope.validateUsername = function(form) {
		$scope.validate(form, 'username', null);
		$scope.error(form, 'username', null);
		form.checking = null;

		if (form.user.username) {	
			if (!form.user.username.match(/^[a-z0-9_-]{3,16}$/i)) {
				form.errors.username = 'invalid chars';
			}
			if (form.user.username.length > 16) {
				form.errors.username = 'too long (> 16 chars)';
			}
			if (form.user.username.length < 3) {
				form.errors.username = 'too short (< 3 chars)';
			}
			if (!form.errors.username) {
				form.checking = '...checking';
				// asynchronously complete validation
				$http.get('/auth/users/'+form.user.username+'/exists')
					.success(function(user) {
						if (user.exists) {
							form.errors.username = 'taken';
						} else {
							form.validations.username = 'ok!';
						}
					});
			}
		} else {
			$scope.error(form, 'user', 'blank');
		}

	}

	$scope.validatePassword = function(form) {
		if (form.user.password) {
			$scope.validate(form, 'password', 'ok!');
		} else {
			$scope.error(form, 'password', 'blank');
		}
		$scope.validatePasswordConfirm(form);
	}

	$scope.validatePasswordConfirm = function(form) {
		if (form.user.password === form.user.passwordConfirm) {
			$scope.validate(form, 'passwordConfirm', 'ok!');
		} else {
			$scope.error(form, 'passwordConfirm', 'mismatch');
		}
	}

	$scope.signup = function(form) {
		
		// sanity checks done	
		if (!form.validations.username ||
		  	!form.validations.password ||
		   	!form.validations.passwordConfirm) {
			return false
		}
		
		$scope.isSigningUp = true;

		Auth.createUser(form.user, function(err) {
			$scope.isSigningUp = false;
			if(!err) {
				$location.path('/');
			} else {
				// all errors should be caught
				// during the pre-authorization
				// TODO: sugarcoat errors on server side
				// to handle this better
				$scope.signupError = err.data.mesasge;
			}
		});

	};
}]);
