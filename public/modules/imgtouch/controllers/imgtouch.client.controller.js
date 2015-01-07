'use strict';

// NOTE: we are using the FileUpload directive from the 'core' module.
// We don't declare it here because we have already required our declarations for anything in the 'core' module
angular.module('imgtouch').controller('ImgtouchController', ['$scope',
  function($scope) {
    /*global $*/ //this tells jshint that we assume jquery to exist
    // Controller Logic

    // Wrapper function, interfaces with UI, doesn't actually do any of the logic, just sets it up
    $scope.downloadAll = function(files) {
      //reset depth count
      $scope.downloadDepth = 0;

      // Since we are using files as a model to handle our view, we copy it to another array to handle the data maniuplation
      // to keep the initial dataset clean
      var downloadFiles = files.slice(0);
      handleDownloadAll(downloadFiles);
    };

    // Actual logic for downloading all files that have been uploaded to the app
    function handleDownloadAll(files) {
      // If we don't detect any files, go up a depth in the recursion, will end recursion if depth highest
      if (files.length === 0) return;
      var file = files.pop();

      // Create a new image object to load our image data into
      var img = new Image();
      img.onload = function() {
        // After data has been loaded, we can do stuff, i.e. add buffer pixels to top of image
        // Create canvas object first, we don't need to create a canvas in HTML and refer to that because that
        // is stupid. We can do it in code, reference it, and remove it, without any way for the user to see
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // Resize the canvas to the size of the image
        canvas.width = img.width;
        canvas.height = img.height + parseInt($scope.topbuffer.h || 0);
        // If there is buffer pixels specified, we add it
        ctx.rect(0, 0, img.width, $scope.topbuffer.h || 0);
        ctx.fillStyle = 'black';
        ctx.fill();
        // Fill image in after top buffer has been placed
        ctx.drawImage(img, 0, $scope.topbuffer.h || 0); // Or at whatever offset you like

        // Create temporary anchor element, bind src, download and remove
        var theAnchor = $('<a />')
          .attr('href', canvas.toDataURL())
          // .attr('download', (img.name || 'file') + img.depth);
          .attr('download', (img.name || 'file') + '_touched.' + img.extension);
        theAnchor[0].click();
        theAnchor.remove();
      };
      // Here we save the depth as a property of the image object because the onload event is asynchronous
      // so we need a way to refer to it when it actually loads.
      img.depth = $scope.downloadDepth;
      // Load the file
      img.name = file.name;
      img.extension = file.extension;
      img.src = file.src;

      // Increment the depth and go deeper into the recursive algorithm
      $scope.downloadDepth++;
      handleDownloadAll(files); // WE MUST GO DEEPER
    }
  }
]);
