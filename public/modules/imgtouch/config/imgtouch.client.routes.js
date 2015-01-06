'use strict';

//Setting up route
angular.module('imgtouch').config(['$stateProvider',
	function($stateProvider) {
		// Imgtouch state routing
		$stateProvider.
		state('imgtouch', {
			url: '/imgtouch',
			templateUrl: 'modules/imgtouch/views/imgtouch.client.view.html'
		});
	}
]);