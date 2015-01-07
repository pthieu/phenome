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

        // NOTE THAT BELOW WAS OLD LOGIC
        // Resize the canvas to the size of the image
        // canvas.width = img.width;
        // canvas.height = img.height + parseInt($scope.topbuffer.h || 0);
        // // If there is buffer pixels specified, we add it
        // ctx.rect(0, 0, img.width, $scope.topbuffer.h || 0);
        // ctx.fillStyle = 'black';
        // ctx.fill();
        // // Fill image in after top buffer has been placed
        // ctx.drawImage(img, 0, $scope.topbuffer.h || 0); // Or at whatever offset you like
        // END OLD LOGIC

        canvas.width = img.width;
        canvas.height = img.height;
        // Fill image in after top buffer has been placed
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
        canvas = splitImage(canvas, $scope.topbuffer.y, $scope.topbuffer.h);
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

    function splitImage(_canvas, _y, _h) {
      // NOTE: THIS ISN'T DOING ANY CHECKS ON PARAMETERS PASSED IN. COULD BREAK IF _y or _h GREATER THAN HEIGHT OF _canvas/canvas

      // Assuming just one split, two parts
      // Create new canvas with new height, we are going to return this one after making modifications
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      // Height of modified canvas is old canvas plus the amount of pixels we're adding
      canvas.height = _canvas.height + _h;
      canvas.width = _canvas.width;
      // Paint top part of old canvas old canvas onto new canvas
      // drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
      // img: can be image object or other canvas
      // sx/sy: starting x/y positions to clip from source
      // swidth/sheight: w/h to clip from starting location
      // x/y: starting location of destination canvas
      // width/height: where to copy clipped src to, will stretch or shrink src

      // Clip out top part of old canvas, draw it on new one
      ctx.drawImage(_canvas, 0, 0, _canvas.width, _y, 0, 0, canvas.width, _y);
      // Clip out bottom part of canvas, drop it on new one a specific _h away from top part
      // Clip clip whole width of old canvas(sx=0, swidth=_canvas.width), clip height from start of cut to end (sy=_y, sheight=_canvas.height-_y), note that old canvas doesn't have added pixels
      // Copy to new canvas's location after added pixels (x=0, y=_y+_h), copy to whole width of new canvas(width=canvas.width, height=_canvas.height-_y)
      ctx.drawImage(_canvas, 0, _y, _canvas.width, _canvas.height - _y, 0, _y + _h, canvas.width, _canvas.height - _y);

      // Add the buffer pixels to the proper section
      ctx.rect(0, _y, canvas.width, _h);
      ctx.fillStyle = 'black';
      ctx.fill();

      // Return the new canvas so that we can download it
      return canvas;
    }
  }
]);
