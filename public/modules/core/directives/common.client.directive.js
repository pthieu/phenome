'use strict';

angular.module('core').directive('fileUpload', [
  function() {
    return {
      template: '<div class="dropzone">' +
        '<i class="fa fa-cloud-upload"></i>' +
        '<input id="files" multiple="true" name="files[]" type="file">Drop files or click here</input>' +
        '</div>',
      restrict: 'E',
      scope: {
        'imgList': '='
      },
      link: function postLink($scope, element, attrs) {
        $scope.imgList = [];
        function handleFileDrop(e) {
          e.stopPropagation();
          e.preventDefault();

          //show results area
          // $('.results_wrap.hidden').removeClass('hidden');

          // Make sure the drop effect can only be limited to file drops, i.e. copy. this prevents html files from going to another page
          if (!!e.dataTransfer) e.dataTransfer.dropEffect = 'copy';

          var filesRAW;
          // $(this).removeClass('blueborder');

          // Check if user performed drag and drop or button click for upload
          if (!!e.dataTransfer) {
            //if drag and drop
            filesRAW = e.dataTransfer.files;
          } else {
            //if click and select
            filesRAW = e.target.files;
          }
          function fileReaderDone(f) {
              //we return an object because we want variable file to be in the scope of the function (as variable f)
              return function(e) {
                // docDefinition = {content:[{image: e.target.result,width: 150, height: 150}]}
                // pdfMake.createPdf(docDefinition).download('test.pdf')
                //we also want variable e to be the input parameter from ouput of readAsDataURL
                // f['url'] = e.target.result;
                // f['size'] = getImageSize(f.url);
                // Convert src to window URL
                // file['src'] = window.URL.createObjectURL(filesRAW[i]);
                // Push the byte src into imgList variable, which is linked to the imgList variable outside of the fileUpload directive
                $scope.imgList.push(e.target.result);
                $scope.$apply();
                // f['size'] = getImageSize(f.url);

                // var fullsize = JSON.stringify({'w':f.size.width, 'h':f.size.height});
                // Calculate landscape or portrait using w/h ratios, if return false, then image size 0x0
                // var imgRatio = calcRatio(f.size.width, f.size.height);
                // if (!imgRatio) return;

                // f['crop'] = imgRatio[0]; //number of screens there are (number rounded up)
                // f['max_h'] = imgRatio[1]; //max height screen can be (includes margins)

                // Generate the preview panels
                // var config_screen = [
                //     "<div class='fileinfo'>" + f.name + "</div>",
                //     "<div class='config_screen'>",
                //       // "<div class='opt_wrap remove'>",
                //       //   "<button title='Remove from PDF'><i class='fa fa-times'></i></button>",
                //       //   "<span>Remove</span>",
                //       // "</div>",
                //       "<div class='opt_wrap margin_btn'>",
                //         "<button title='Set custom margins'><i class='fa fa-arrows-alt'></i></button>",
                //         "<span>Margins</span>",
                //       "</div>",
                //       "<div class='opt_wrap preview'>",
                //         "<button title='Splice image by dragging red lines'><i class='fa fa-search-plus'></i></button>",
                //         "<span>Splicer</span>",
                //       "</div>",
                //       "<div class='margins_wrap hidden'>",
                //         "<div class='margins'>",
                //           "<div class='margin msg'>",
                //             "<span style='font-style:italic'>Close menu to drag again</span>",
                //           "</div>",
                //           "<div class='margin msg'>",
                //             "<span style='font-style:italic'>(Units in inches)</span>",
                //           "</div>",
                //           "<div class='margin'>",
                //             "<label>Top:</label><input class='top' />",
                //           "</div>",
                //           "<div class='margin hidden'>",
                //             "<label>Bottom:</label><input class='bottom' />",
                //           "</div>",
                //           "<div class='margin'>",
                //             "<label>Left:</label><input class='left' />",
                //           "</div>",
                //           "<div class='margin'>",
                //             "<label>Right:</label><input class='right' />",
                //           "</div>",
                //           "<div class='margin msg'>",
                //             "<span style='font-style:italic'>Input numbers only!</span>",
                //           "</div>",
                //           "<div class='margin'>",
                //             "<button class='resplice_btn'>Re-splice</button>",
                //           "</div>",
                //         "</div>",
                //       "</div>",
                //     "</div>"
                //   ].join('');

                // I believe we commented out conditional statement because we will add a timestamp for every single image uploaded regardless of crop size
                // if (f.crop > 1) {

                //use time stamp to get unique group identifier
                // var timestamp = (new Date()).getTime();
                //write to canvas and split into however many sections
                // splitCanvas(e.target.result, timestamp);
                //splitCanvas has async calls so we have to add a div group skeleton and fill it up later
                // var addIMG = ["<div class='thumb_wrap crop_group ", timestamp,
                  // "' data-src='" + f.src + "' data-fullsize='" + fullsize + "' data-timestamp='" + timestamp + "'><div draggable='true' class='drag_overlay'></div>",
                  // config_screen, "</div>"
                // ].join('');
                // }
                // else {
                //   //append image to div -- single page no crop isn't an async call so just add it
                //   var addIMG = ["<div class='thumb_wrap' data-src='"+f.src+"'><div draggable='true' class='drag_overlay'></div>" + config_screen + "<div class='thumb_crop'><div class='opt_wrap remove'><button title='Remove from PDF'><i class='fa fa-times'></i></button></div><div class='bg_cross'></div><span><img src='", f.url, "' class='thumb' /></span></div></div>"].join('');
                //   rebindConfig();
                // }
                // $('#list').append(addIMG);

                // rebindThumbHandlers();
              };
            }

          // Check the type of each uploaded file, we only care if it's an image file
          for (var i = 0; i < filesRAW.length; i++) {
            if (!(filesRAW[i].type) || !filesRAW[i].type.match(/image/)) {
              continue;
            }

            //start a new read stream per file
            var reader = new FileReader();
            var file = {};

            // file['name'] = filesRAW[i].name;
            // file['type'] = filesRAW[i].type;
            // file['src'] = window.URL.createObjectURL(filesRAW[i]);

            // This logic that runs when the file actually loads into the FileReader
            reader.onloadend = (fileReaderDone)(file); // this is using the file variable we defined earlier

            //this is async
            reader.readAsDataURL(filesRAW[i]);
            // files.push(file);
          }
        }

        var dropZone = document.getElementsByClassName('dropzone')[0];
        // dropZone.addEventListener('dragover', handleDragOver, false);
        // dropZone.addEventListener('dragleave', handleDragLeave, false);
        dropZone.addEventListener('drop', handleFileDrop, false);
        dropZone.addEventListener('change', handleFileDrop, false);
      }
    };
  }
]);
