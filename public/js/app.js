angular.module('rosaApp', [
	'MainCtrl',
	'ui.router'
])
.run([       '$rootScope', '$state', '$stateParams',
	function( $rootScope ,  $state ,  $stateParams ) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
	}	
])
.config([    '$stateProvider', '$urlRouterProvider',
	function( $stateProvider ,  $urlRouterProvider ) {
		
		// Redirects
		
		$urlRouterProvider
			// redirect 404s to home state
			.otherwise('/');

		// State configs
		
		$stateProvider
			// home state
			.state('home', {
				url: '/',
				templateUrl: 'views/partials/home.html'
			});
	}
]);
