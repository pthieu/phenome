'use strict';

  // app.filter('reverse', function() {
  //   return function(items) {
  //     return items.slice().reverse();
  //   };
  // });

angular.module('creeper').filter('reverse', function() {
  	return function(items) {
     	return items.slice().reverse();
    };
});