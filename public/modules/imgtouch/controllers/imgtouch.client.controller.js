'use strict';

// NOTE: we are using the FileUpload directive from the 'core' module.
// We don't declare it here because we have already required our declarations for anything in the 'core' module
angular.module('imgtouch').controller('ImgtouchController', ['$scope',
  function($scope) {
    // Controller Logic
    // setInterval(function () {
    // console.log($scope.imgList);
    // },1000);

    $scope.downloadAll = function(files) {
      /*global $*/ // This tells jshint that we assume jquery to exist

      if (files.length === 0) return;
      var file = files.pop();
      var theAnchor = $('<a />')
        .attr('href', file)
        .attr('download', 'file'+files.length);
      theAnchor[0].click();
      theAnchor.remove();
      $scope.downloadAll(files);
    };
  }
]);
