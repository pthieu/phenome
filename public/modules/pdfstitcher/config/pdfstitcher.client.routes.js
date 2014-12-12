'use strict';

//Setting up route
angular.module('pdfstitcher').config(['$stateProvider',
	function($stateProvider) {
		// Pdfstitcher state routing
		$stateProvider.
		state('pdfstitcher', {
			url: '/pdfstitcher',
			templateUrl: 'modules/pdfstitcher/views/pdfstitcher.client.view.html'
		});
	}
]);