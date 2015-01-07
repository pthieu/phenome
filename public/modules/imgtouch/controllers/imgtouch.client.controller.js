'use strict';

// NOTE: we are using the FileUpload directive from the 'core' module.
// We don't declare it here because we have already required our declarations for anything in the 'core' module
angular.module('imgtouch').controller('ImgtouchController', ['$scope',
  function($scope) {
      /*global $*/ //this tells jshint that we assume jquery to exist

    // Controller Logic
    // setInterval(function () {
    // console.log($scope.imgList);
    // },1000);

    $scope.downloadAll = function(files) {
      //reset depth count
      $scope.downloadDepth = 0;

      // Since we are using files as a model to handle our view, we copy it to another array to handle the data maniuplation
      // to keep the initial dataset clean
      var downloadFiles = files.slice(0);
      handleDownloadAll(downloadFiles);
    };

    function handleDownloadAll(files){
      // If we don't detect any files, go up a depth in the recursion
      if (files.length === 0) return;
      var file = files.pop();

      var img = new Image();
      img.onload = function() {
        // Add buffers to top or bottom of image
        var canvas = document.createElement('canvas');
        // $scope.canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height + parseInt($scope.topbuffer || 0);
        ctx.rect(0, 0, img.width, $scope.topbuffer || 0);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.drawImage(img, 0, $scope.topbuffer || 0); // Or at whatever offset you like

        // Create temporary anchor element, bind src, download and remove
        var theAnchor = $('<a />')
          .attr('href', canvas.toDataURL())
          .attr('download', 'file' + img.depth);
        theAnchor[0].click();
        theAnchor.remove();
      };
      img.depth = $scope.downloadDepth;      
      img.src = file;

      $scope.downloadDepth++;
      handleDownloadAll(files);
    }
  }
]);
