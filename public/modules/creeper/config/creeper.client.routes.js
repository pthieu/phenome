'use strict';

//Setting up route
angular.module('creeper').config(['$stateProvider',
	function($stateProvider) {
		// Creeper state routing
		$stateProvider.
		state('creeper', {
			url: '/creeper',
			templateUrl: 'modules/creeper/views/creeper.client.view.html'
		});
	}
]);