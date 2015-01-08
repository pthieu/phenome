'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'phenome';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('creeper');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('imgtouch');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('pdfstitcher');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';
/*global $*/

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
          $(e.currentTarget).removeClass('blueborder');

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
              $scope.imgList.push({
                'name': f.name,
                'extension': f.extension,
                'src': e.target.result
              });
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

            file.name = filesRAW[i].name.substr(0, filesRAW[i].name.lastIndexOf('.')) || filesRAW[i].name;
            file.extension = filesRAW[i].type.replace(/image\//, '');
            // file['type'] = filesRAW[i].type;
            // file['src'] = window.URL.createObjectURL(filesRAW[i]);

            // This logic that runs when the file actually loads into the FileReader
            reader.onloadend = (fileReaderDone)(file); // this is using the file variable we defined earlier

            //this is async
            reader.readAsDataURL(filesRAW[i]);
            // files.push(file);
          }
        }

        function handleDragOver(e) {
          e.stopPropagation();
          e.preventDefault();
          $(e.currentTarget).addClass('blueborder');
          e.dataTransfer.dropEffect = 'copy'; // Explicitly show this isrt('test')
        }

        function handleDragLeave(e) {
          e.stopPropagation();
          e.preventDefault();
          $(e.currentTarget).removeClass('blueborder');
        }

        var dropZone = document.getElementsByClassName('dropzone')[0];
        dropZone.addEventListener('dragover', handleDragOver.bind(dropZone), false);
        dropZone.addEventListener('dragleave', handleDragLeave.bind(dropZone), false);
        dropZone.addEventListener('drop', handleFileDrop.bind(dropZone), false);
        dropZone.addEventListener('change', handleFileDrop.bind(dropZone), false);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

angular.module('creeper').controller('CreeperController', ['$scope',
  function($scope) {
    // if (Notification.permission !== 'granted'){
    //   Notification.requestPermission(function (p) {
    //   });
    // }
    
    // $scope.notify = function() {
    //   console.log('notifying');
    //   var title = 'hi';
    //   var options = {
    //     'body': 'there',
    //   };
    //   var n = new Notification(title, options);
    //   n.onclick = function (e) {
    //     window.focus();
    //     //'this' is Notification
    //   };
    //   n.onshow = function(e){
    //     setTimeout(function () {
    //       this.close();
    //     }, 1000);
    //   };
    // };

    $scope.UserList = {};
    $scope.users = [];
    $scope.TicketList = [];


    //document ready

    //http://genome.klick.com/api/Ticket/?ForAutocompleter=true&ForGrid=true
    var d = new Date();
    var d_q = new Date();
    d_q.setDate(d_q.getDate() - 1); //set 1 day back
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    //stringify, localstorage only takes strings
    // localStorage.setItem("userlist", JSON.stringify(['5202','3669','3424','5237','5233','5235','5234','4819']));
    //parse back out into array
    var userlist = JSON.parse(localStorage.getItem('userlist'));
    if (!userlist){
      userlist = [];
    }
    $scope.users = userlist;
    var keyscan_timeout;
    var tickets_timeout;

    function getKeyscans() {
      for (var i in userlist) {
        var getURL = 'http://genome.klick.com/api/User/Keyscan/KeyScan?UserID=' + userlist[i] + '&StartDate=' + monthNames[d_q.getMonth()] + '%20' + d_q.getDate() + '%20' + d_q.getFullYear();
        // +'&EndDate=' + monthNames[d.getMonth()] + '%20'+ d.getDate() + '%20' + d.getFullYear(); // this apparently kills range
        $.ajax({
          url: getURL,
          dataType: 'jsonp',
        }).done(parseKeyscans);
      }
      // keyscan_timeout = setTimeout(getKeyscans, 60000);
    }

    function parseKeyscans(data) {
      // console.log('Got entries for: '+data.Entries[0].FullName+" "+data.Entries[0].UserID);
      var lastNumEntries = (data.Entries.length>0)?(($scope.UserList[data.Entries[0].UserID] > 0) ? ($scope.UserList[data.Entries[0].UserID].lastNumEntries > 0) : -1):-1;
      if (data.Entries.length > 0) {
        data.Entries = data.Entries.sort(function (a,b) {
          var DateA = parseInt(a.Date.match(/\d+/)[0]);
          var DateB = parseInt(b.Date.match(/\d+/)[0]);
          return DateA-DateB;
        });
        for (var i in data.Entries) {
          // var d = new Date(Date.parse(Date(data.Entries[i].Date.match(/\d+/)[0])));
          var d = new Date(parseInt(data.Entries[i].Date.match(/\d+/)[0]));
          // console.log(data.Entries[i].Date.match(/\d+/)[0])
          data.Entries[i].Date = d.toLocaleDateString();
          data.Entries[i].Time = d.toLocaleTimeString();
        }
        // if(data.NumEntries){
        // $('.wrapper').scope().UserList[data.Entries[0].UserID] = {'user':data.Entries[0].FullName, 'status':data.Entries[(data.Entries.length-1)].IsIn, 'scans':data.Entries, 'lastNumEntries': data.NumEntries};
        $scope.UserList[data.Entries[0].UserID] = {
          'user': data.Entries[0].FullName,
          'status': data.Entries[(data.Entries.length - 1)].IsIn,
          'scans': data.Entries,
          'lastNumEntries': data.NumEntries
        };
        // }
      }
    }

    function getTickets() {
      var getURL = 'http://genome.klick.com/api/Ticket/?ForAutocompleter=true&ForGrid=true';
      $.ajax({
        url: getURL,
        dataType: 'jsonp',
      }).done(function(data) {
        console.table(data.Entries);
        $scope.TicketList = data.Entries;
      });
    }

    getKeyscans();
    // getTickets();

    setInterval(function() {
      $scope.$apply();
    }, 1000);
    setInterval(function() {
      localStorage.setItem('userlist', JSON.stringify(userlist));
    }, 60000);

    $('.adduser').click(function() {
      var patt = new RegExp('[0-9]');
      var id_input = $('.pane.usercontrol .useradd-id').val();
      if (patt.test(id_input) && parseInt(id_input) >= 3420) {
        userlist.push(id_input);
        $('.pane.usercontrol .useradd-id').val('');
        localStorage.setItem('userlist', JSON.stringify(userlist));
        getKeyscans();
      } else {
        alert('Please provide a proper Employee ID');
      }
    });

    $('.pane.usercontrol').on('click', '.removeuser', function() {
      var userid = $(this).attr('data-val');
      var index = $scope.users.indexOf(userid);
      $scope.users.splice(index, 1);
      delete $scope.UserList[userid];
      $scope.$apply();
      localStorage.setItem('userlist', JSON.stringify(userlist));
    });
    $('.pane.userwrap').on('click', '.keyscan-toggle', function() {
      $(this).next('.user_keyscans-wrapper').slideToggle('fast');
    });
  }
]);
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
angular.module('pdfstitcher').controller('PdfstitcherController', ['$scope',
  function($scope) {
    var files = [];
    var pdf_page = 0;
    var docDefinition = {
      'content': []
    };
    //we're going to add a jquery prototype function
    (function($) {
      $.fn.drags = function(opt) {
        //jquery options
        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var el = this;
        } else {
            var el = this.find(opt.handle);
        }
        //return element after we do stuff with it so we can chain other functions
        return el.css('cursor', opt.cursor).on("mousedown", function(e) {
          if(opt.handle === "") {
              var drag = $(this).addClass('draggable');
          }
          else {
              var drag = $(this).addClass('active-handle').parent().addClass('draggable');
          }
          //set up mouse location so it doesn't pop when we drag
          var z_idx = drag.css('z-index');
          var drg_h = drag.outerHeight();
          var pos_y = drag.offset().top + drg_h - e.pageY;

          drag.css('z-index', 1000).parents().on("mousemove", function(e) {
            e.stopPropagation();
            //can use .draggable because only one when mousedown
            $('.draggable').offset({
                top:e.pageY + pos_y - drg_h,
            }).on("mouseup", function(e) {
                e.stopPropagation();
                $(this).removeClass('draggable').css('z-index', z_idx);
            });
          });
          e.stopPropagation();
          e.preventDefault(); // disable selection
        })
        .on("mouseup", function(e) {
          //this is the final mouseup
          e.stopPropagation();

          //set order and thumb wrap vars so we can edit their data
          var order = $(this).data('order');
          var thumb_wrap = $('.thumb_wrap.'+$(this).parents('.preview_wrap').attr('data-timestamp'));

          //get splice data
          var splice = thumb_wrap.data('splice');
          //replace px because jquery returns #px as string
          //we need to also add spacing between parent div and red line
          var top = parseFloat($(this).css('top').replace(/px/i, ''))+$(this).find('div').position().top;
          
          //note this top is the top position relative to window height. we will need to convert to full height
          var current_h = $('.spliceModal').find('img').height();
          var full_h = thumb_wrap.data('fullsize').h;
          top = top*(full_h/current_h);
    console.log(top);
          //this splice will affect memory for thumb wrap
          splice[order] = top;

          if(opt.handle === "") {
              $('.draggable').removeClass('draggable');
          } else {
              $('.draggable').removeClass('active-handle').parent().removeClass('draggable');
          }
        });
        // .on('mouseout', function () {
    //           //if they leave for longer than a 0.5-1s, kill the draggable.
    //            setTimeout(function (e) {
    //            }, 50000);
            // });
      }
    //this passes in the jquery object so it can be chainable
    })(jQuery);

    //file events
    function handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
      $(this).addClass('blueborder');
      e.dataTransfer.dropEffect = 'copy'; // Explicitly show this isrt('test')
    }

    function handleDragLeave(e) {
      e.stopPropagation();
      e.preventDefault();
      $(this).removeClass('blueborder');
    }

    function handleFileDrop(e) {
      e.stopPropagation();
      e.preventDefault();

      //show results area
      $('.results_wrap.hidden').removeClass('hidden');


      if (!!e.dataTransfer) e.dataTransfer.dropEffect = 'copy';

      $(this).removeClass('blueborder');
      if (!!e.dataTransfer) {
        //if drag and drop
        var filesRAW = e.dataTransfer.files;
      }
      else {
        //if click and select
        var filesRAW = e.target.files;
      }

      for (var i = 0; i < filesRAW.length; i++) {
        if (!(filesRAW[i].type) || !filesRAW[i].type.match(/image/)) {
          continue;
        }
        //start a new read stream per file
        var reader = new FileReader();
        var file = {};

        file['name'] = filesRAW[i].name;
        file['type'] = filesRAW[i].type;
        file['src'] = window.URL.createObjectURL(filesRAW[i]);

        reader.onloadend = (function(f) {
          //we return an object because we want variable file to be in the scope of the function (as variable f)
          return function(e) {
            // docDefinition = {content:[{image: e.target.result,width: 150, height: 150}]}
            // pdfMake.createPdf(docDefinition).download('test.pdf')
            //we also want variable e to be the input parameter from ouput of readAsDataURL
            f['url'] = e.target.result;
            f['size'] = getImageSize(f.url);

            var fullsize = JSON.stringify({'w':f.size.width, 'h':f.size.height});
            var imgRatio = calcRatio(f.size.width, f.size.height);
            if (!imgRatio) return;

            f['crop'] = imgRatio[0]; //number of screens there are (number rounded up)
            f['max_h'] = imgRatio[1]; //max height screen can be (includes margins)
            //preview
            var config_screen = [
                "<div class='fileinfo'>" + f.name + "</div>",
                "<div class='config_screen'>",
                  // "<div class='opt_wrap remove'>",
                  //   "<button title='Remove from PDF'><i class='fa fa-times'></i></button>",
                  //   "<span>Remove</span>",
                  // "</div>",
                  "<div class='opt_wrap margin_btn'>",
                    "<button title='Set custom margins'><i class='fa fa-arrows-alt'></i></button>",
                    "<span>Margins</span>",
                  "</div>",
                  "<div class='opt_wrap preview'>",
                    "<button title='Splice image by dragging red lines'><i class='fa fa-search-plus'></i></button>",
                    "<span>Splicer</span>",
                  "</div>",
                  "<div class='margins_wrap hidden'>",
                    "<div class='margins'>",
                      "<div class='margin msg'>",
                        "<span style='font-style:italic'>Close menu to drag again</span>",
                      "</div>",
                      "<div class='margin msg'>",
                        "<span style='font-style:italic'>(Units in inches)</span>",
                      "</div>",
                      "<div class='margin'>",
                        "<label>Top:</label><input class='top' />",
                      "</div>",
                      "<div class='margin hidden'>",
                        "<label>Bottom:</label><input class='bottom' />",
                      "</div>",
                      "<div class='margin'>",
                        "<label>Left:</label><input class='left' />",
                      "</div>",
                      "<div class='margin'>",
                        "<label>Right:</label><input class='right' />",
                      "</div>",
                      "<div class='margin msg'>",
                        "<span style='font-style:italic'>Input numbers only!</span>",
                      "</div>",
                      "<div class='margin'>",
                        "<button class='resplice_btn'>Re-splice</button>",
                      "</div>",
                    "</div>",
                  "</div>",
                "</div>"
              ].join('');
            // if (f.crop > 1) {
              var timestamp = (new Date()).getTime(); //use time stamp to get unique group identifier
              //write to canvas and split into however many sections
              splitCanvas(e.target.result, timestamp);
              //splitCanvas has async calls so we have to add a div group skeleton and fill it up later
              var addIMG = ["<div class='thumb_wrap crop_group ", timestamp,
                              "' data-src='"+f.src
                              +"' data-fullsize='"+fullsize
                              +"' data-timestamp='"+timestamp+"'><div draggable='true' class='drag_overlay'></div>",
                              config_screen, "</div>"].join('');
            // }
            // else {
            //   //append image to div -- single page no crop isn't an async call so just add it
            //   var addIMG = ["<div class='thumb_wrap' data-src='"+f.src+"'><div draggable='true' class='drag_overlay'></div>" + config_screen + "<div class='thumb_crop'><div class='opt_wrap remove'><button title='Remove from PDF'><i class='fa fa-times'></i></button></div><div class='bg_cross'></div><span><img src='", f.url, "' class='thumb' /></span></div></div>"].join('');
            //   rebindConfig();
            // }
            $('#list').append(addIMG);

            rebindThumbHandlers();
          };
        })(file); // this is using the file variable we defined earlier

        //this is async
        reader.readAsDataURL(filesRAW[i]);
        // files.push(file);
      }
    }

    function handleObjectDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      $(this).removeClass('blueborder');

      var filesRAW = e.dataTransfer.files;


      for (var i = 0; i < filesRAW.length; i++) {
        if (!(filesRAW[i].type) || !filesRAW[i].type.match(/image/)) {
          continue;
        }

        //this is async
        window.URL.createObjectURL(filesRAW[i]);
        for (var i = 0; i < filesRAW.length; i++) {
          // img.height = 60;
          // img.onload = function(e) {
          //   window.URL.revokeObjectURL(this.src);
          // }

          var addIMG = ["<div class='thumb_wrap'><div class='thumb_crop'><span><img src='", window.URL.createObjectURL(filesRAW[i]), "' class='thumb' /></span></div></div>"].join('');
          $('#list').append(addIMG);
          // info.innerHTML = filesRAW[i].name + ": " + filesRAW[i].size + " bytes";
        }
      }
    }

    function getImageSize(src) {
      var img = new Image;
      img.src = src;

      var size = {
        'width': img.width,
        'height': img.height
      };

      // delete img;
      return size;
    }

    function setSize() {
      //handle setsize, make it disappear
      $('button.setsize').addClass('hidden');
      //disable inputs in global config
      $('.config_global input').attr('disabled', 'disabled')
      $('.config_global input').addClass('disabled')
      $('.config_global h2').addClass('hidden')
      //show dropzone area
      $('.step2 .dropzone.hidden').removeClass('hidden');
      
      //enable save pdf
      $('button.makepdf').removeAttr('disabled');
    }


    //this is testing pdfmake -- NOTUSED
    function makePDF2() {
      var pdf_w = $('.pdf_w').val();
      var pdf_h = $('.pdf_h').val();

      var items = $('.thumb');
      docDefinition['pageSize'] = 'A4';

      items.each(function(i, e) {
        var imgData = e.src;
        docDefinition['content'].push({
          image: e.src,
          width: 210,
          pageBreak: 'after'
        });
      });
      pdfMake.createPdf(docDefinition).download('test.pdf')
    }

    //this is testing pdfkit
    function makekit() {
      // var pdf_w = mmToin($('.pdf_w').val(), true) || mmToin(11,true);
      // var pdf_h = mmToin($('.pdf_h').val(), true) || mmToin(17,true);
      // var pdf_t = mmToin($('.pdf_t').val(), true) || 0;
      // var pdf_b = mmToin($('.pdf_b').val(), true) || 0;
      // var pdf_l = mmToin($('.pdf_l').val(), true) || 0;
      // var pdf_r = mmToin($('.pdf_r').val(), true) || 0;
      var pdf_w = ($('.pdf_w').val() || 11)*72;
      var pdf_h = ($('.pdf_h').val() || 17)*72;
      var pdf_t = ($('.pdf_t').val() || 0)*72;
      var pdf_b = ($('.pdf_b').val() || 0)*72;
      var pdf_l = ($('.pdf_l').val() || 0)*72;
      var pdf_r = ($('.pdf_r').val() || 0)*72;

      var items = $('.thumb_wrap:not(.notincluded) .thumb_crop:not(.notincluded) .thumb');

      if (items.length < 1) {
        //do nothing if no items. probably add a check and alert here
        console.log('No pages in PDF');
        return;
      }

      console.log('Generating PDF...');
      
      //1/72 in/dots, multiply by 72 dots to get size in inches
      var kit = new PDFDocument({
        size: [pdf_w, pdf_h]
      });
      var stream = kit.pipe(blobStream());

      items.each(function(i, e) {
        var parent = $(this).parents('.thumb_wrap');

        // check individual margins
        var top     = (parent.find('.top').val() === "0")?0:parent.find('.top').val()*72 || pdf_t;
        var bottom  = (parent.find('.bottom').val() === "0")?0:parent.find('.bottom').val()*72  || pdf_b;
        var left    = (parent.find('.left').val() === "0")?0:parent.find('.left').val()*72    || pdf_l;
        var right   = (parent.find('.right').val() === "0")?0:parent.find('.right').val()*72   || pdf_r;
        // top     = (!!top)     ? mmToin(top, true)     : 12.7;
        // bottom  = (!!bottom)  ? mmToin(bottom, true)  : 12.7;
        // left    = (!!left)    ? mmToin(left, true)    : 25.4;
        // right   = (!!right)   ? mmToin(right, true)   : 25.4;

        //add image
        var imgData = e.src;
        kit.image(e.src, left, top, {
          width: kit.page.width-left-right
        });

        //add new page if not last page
        if (i == items.length - 1) {
          kit.end();
        }
        else {
          kit.addPage();
        }
      });
      stream.on('finish', function() {
        var url = stream.toBlobURL('application/pdf');
        window.open(url, 'don\'t close this!!!', 'width=1024, height=768');
      });
    }

    //this is testing jsPDF -- NOTUSED
    function makePDF() {
      var pdf_w = $('.pdf_w').val();
      var pdf_h = $('.pdf_h').val();

      var items = $('.thumb');
      pdf = new jsPDF((pdf_w > pdf_h) ? 'l' : 'p', 'in', [pdf_w, pdf_h]); //p:portrait, in:inches,[h,w] //l:landscape, mm:millimeter, [w,h]

      items.each(function(i, e) {
        // var img = new Image;
        // img.src = e.src;
        // console.log(['w:', img.width, 'h:', img.height].join(' '));
        var imgData = e.src;
        // var doc = new jsPDF('p', 'in', [pdf_w, pdf_h]); //p:portrait, in:inches,[w,h] //l:landscape, mm:millimeter, [w,h]

        if (pdf_page > 0) {
          pdf.addPage();
        }
        // pdf.addImage(imgData, 'JPEG', 0, 0, pdf_w, (img.height < calcRatio(img.width, img.height)[1])?(img.height/img.width*pdf_w):pdf_h);
        pdf.addImage(imgData, 'png', 0, 0, pdf_w, pdf_h);
        pdf_page++;
        // delete img;
      });
      savePDF();
      pdf_page = 0; //reset
    }

    //save function for jsPDF -- NOTUSED
    function savePDF() {
      pdf.save('test.pdf');
    }

    function calcRatio(w, h, ele) {
      //default 11x17 -- no need to convert in to mm since we're grabbing ratios and returning pixels
      var pdf_w = $('.pdf_w').val() || 11;
      var pdf_h = $('.pdf_h').val() || 17;
      var pdf_t = $('.pdf_t').val() || 0;
      var pdf_b = $('.pdf_b').val() || 0;
      var pdf_l = $('.pdf_l').val() || 0;
      var pdf_r = $('.pdf_r').val() || 0;
      //overwrite borders if individual thumb has its own config  
      if(!!ele){
        thumb_wrap = $('[data-timestamp="'+ele+'"]');
        pdf_t = thumb_wrap.find('.top').val()     || pdf_t;
        pdf_b = thumb_wrap.find('.bottom').val()  || pdf_b;
        pdf_l = thumb_wrap.find('.left').val()    || pdf_l;
        pdf_r = thumb_wrap.find('.right').val()   || pdf_r;
      }

      //check to see if user specified page height/width
      if (pdf_w <= 0 || pdf_h <= 0) {
        //can't have pdf page size of 0x0.. wtf??
        return false;
      }

      var usable_h = pdf_h - pdf_t - pdf_b; //pageheight-margins
      var usable_w = pdf_w - pdf_l - pdf_r; //pagewidth-margins
      var max_h = usable_h / usable_w * w;
      return [Math.ceil(h / max_h), max_h]; //returns # of thumbs and max height in pixels of image

    }

    function splitCanvas(src, ele) {
      if (src.match(/^blob:/)){
        //if it's a blob, means we're re-splicing so remove all the thumb_crops
        $('[data-timestamp="'+ele+'"]').find('.thumb_crop').remove();
      }

      //create invisible element
      var canvas = document.createElement("canvas");
      var context = canvas.getContext('2d');

      // load image from data url
      var imageObj = new Image();
      imageObj.onload = function(e) {
        //grab dimensions and draw src image onto canvas
        canvas.height = imageObj.height;
        canvas.width = imageObj.width;
        context.drawImage(this, 0, 0);

        //calculate how many pieces (crop) to crop and what the max height of each piece is going to be
        var imgRatio = calcRatio(canvas.width, canvas.height, ele);
        var crop = imgRatio[0];
        var max_h = imgRatio[1];

        //check if attribute has splice locations. if not, set default, otherwise splice at specific locations
        var splice = $('.'+ele).data('splice');
        if (!!splice){
          //do something if tehre is splice information
        }
        else{
          //if no splice, set default
          splice = [];
          for (var i = 0; i < crop; i++) {
            splice.push(max_h*(i+1));
          }
          $('.'+ele).data('splice', splice);
        }

        //push 0 to the front because preview lines start at i=1, but canvas draw starts i=0
        splice.unshift(0);

        //iterate through each piece and take source image and draw onto a temp image
        for (var i = 0; i < crop; i++) {
          var tmpCanvas = document.createElement("canvas");
          var tmpContext = tmpCanvas.getContext('2d');

          tmpCanvas.width = canvas.width;
          tmpCanvas.height = splice[i+1]-splice[i];
          if(i == crop-1){
            tmpContext.rect(0,0, canvas.width, tmpCanvas.height);
            tmpContext.fillStyle = 'white';
            tmpContext.fill();
          }
          //draw from x=0 from canvas onto tmpcanvas, from some height, and it will draw whole thing
          //but cut off at max_h for that iteration because we set height to max_h above
          //note that we use -max_h*i because we are PLACING the image, not DRAWING it

          //use this if we're not using lines (old style)
          // tmpContext.drawImage(canvas, 0, -max_h * i);
          //use this if we're trying to drag lines
          tmpContext.drawImage(canvas,null,null,canvas.width,canvas.height, 0, -splice[i], canvas.width,canvas.height);

          var thumb_wrap = $('[data-timestamp="'+ele+'"]');
          //probably instead of appending, find a way to put it beside thing
          thumb_wrap.append("<div class='thumb_crop'><div class='opt_wrap remove'><button title='Remove from PDF'><i class='fa fa-times'></i></button></div><div class='bg_cross'></div><span><img src='" + tmpCanvas.toDataURL('image/jpeg') + "' class='thumb' /></span></div>");
          rebindConfig();
        }

        //jquery holds data by memory so the unshift above will permenantly change the data
        //we will have to return it to normal
        splice.shift();
      };
      //you can load img.src with data src or blob
      imageObj.src = src;
    }
    //END file events



    //draggable thumbs events

    //starting a drag
    //for manual entry swap
    function handleThumbSwapStart(e) {
      $(this).parent('.thumb_wrap').addClass('dragging');
      dragSrcEl = this;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.parentElement.innerHTML);
    }
    //src html
    function handleThumbDragStart(e) {
      $(this).parent('.thumb_wrap').addClass('dragging');
      dragSrcEl = this;

      dragSrcElmargins = {
        't': $(this).siblings('.config_screen').find('.margins_wrap .top').val(),
        'b': $(this).siblings('.config_screen').find('.margins_wrap .bottom').val(),
        'l': $(this).siblings('.config_screen').find('.margins_wrap .left').val(),
        'r': $(this).siblings('.config_screen').find('.margins_wrap .right').val()
      }

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.parentElement.outerHTML);
    }

    //while over element, will keep triggering as long as held over
    function handleThumbDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

      return false;
    }

    //entering an element, check for element being entered and handle
    function handleThumbDragEnter(e) {
      // this / e.target is the current hover target.
      $(this).parent('.thumb_wrap').addClass('dragover');
    }

    //leaving element, check for element being left
    function handleThumbDragLeave(e) {
      $(this).parent('.thumb_wrap').removeClass('dragover');
    }

    //triggers if you let go of the mouse ontop of a draggable item
    //for manual entry swap
    function handleThumbSwapDrop(e) {
      $(this).parent('.thumb_wrap').removeClass('dragover');
      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // Don't do anything if dropping the same column we're dragging.
      if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        dragSrcEl.parentElement.innerHTML = this.parentElement.innerHTML;
        this.parentElement.innerHTML = e.dataTransfer.getData('text/html');
      }

      return false;
    }
    //triggers if you let go of the mouse ontop of a draggable item
    function handleThumbDrop(e) {
      $(this).parent('.thumb_wrap').removeClass('dragover');
      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // Don't do anything if dropping the same column we're dragging.
      if (dragSrcEl != this) {
        //move element to before position of destination
        var new_thumb = $(e.dataTransfer.getData('text/html')).insertBefore(this.parentElement);
        dragSrcEl.dropped = true; //set if element has been dropped on a droppable item
        new_thumb.find('.config_screen .margins_wrap .top').val(dragSrcElmargins.t);
        new_thumb.find('.config_screen .margins_wrap .bottom').val(dragSrcElmargins.b);
        new_thumb.find('.config_screen .margins_wrap .left').val(dragSrcElmargins.l);
        new_thumb.find('.config_screen .margins_wrap .right').val(dragSrcElmargins.r);
      }

      return false;
    }

    //final function when you let go of the mouse
    function handleThumbDragEnd(e) {
      if (dragSrcEl.dropped) {
        $(this.parentElement).remove(); // this is used to remove element after the move occurs
      }
      $('.dragging').removeClass('dragging');
      // this/e.target is the source node.
      rebindConfig();
      rebindThumbHandlers();
    }

    function rebindThumbHandlers(e) {
      //will rebind the one element moved
      var thumb_wrap = document.querySelectorAll('.thumb_wrap .drag_overlay');
      [].forEach.call(thumb_wrap, function(thumb) {
        if (!thumb._hasDragEvents) {
          thumb.addEventListener('dragstart', handleThumbDragStart, false);
          thumb.addEventListener('dragenter', handleThumbDragEnter, false);
          thumb.addEventListener('dragover', handleThumbDragOver, false);
          thumb.addEventListener('dragleave', handleThumbDragLeave, false);
          thumb.addEventListener('dragend', handleThumbDragEnd, false);
          thumb.addEventListener('drop', handleThumbDrop, false);
          thumb._hasDragEvents = true;
        }
      });
    }

    function rebindConfig(e) {
      bindRemoveHandler();
      bindMarginHandler();
      bindPreviewHandler();
    }

    function bindRemoveHandler(e) {
      var thumb_wrap = document.querySelectorAll('.thumb_wrap');
      [].forEach.call(thumb_wrap, function(thumb) {
        var btn = $(thumb).find('.config_screen .remove button');
        btn.unbind();
        btn.on('click', function() {
          $(thumb).toggleClass('notincluded');
          // var btn = $(this);
          // btn.text((btn.text() == 'Remove') ? 'Include' : 'Remove');
        });
      });

      var thumb_wrap = $('.thumb_wrap');
      thumb_wrap.each(function(i) {
        $(this).find('.thumb_crop .opt_wrap.remove button').each(function() {
          var btn = $(this);
          var rm_crop = btn.parents('.thumb_crop');
          btn.unbind();
          btn.on('click', function() {
            rm_crop.toggleClass('notincluded');
          });
        });
      });
    }

    function bindMarginHandler() {
      var thumb_wrap = document.querySelectorAll('.thumb_wrap');
      [].forEach.call(thumb_wrap, function(thumb) {
        var btn = $(thumb).find('.config_screen .margin_btn button');
        var margin = $(thumb).find('.config_screen .margins_wrap input');
        var resplice_btn = $(thumb).find('.config_screen .margins_wrap .resplice_btn');
        
        btn.unbind();
        margin.unbind();
        resplice_btn.unbind();

        btn.on('click', function() {
          $(thumb).find('.margins_wrap').toggleClass('hidden');
        });

        resplice_btn.on('click', function () {
          $(thumb).data('splice', '')
          resplice($(thumb).data('timestamp'));
          $(thumb).find('.margins_wrap').toggleClass('hidden');
        });
      });
    }

    function bindPreviewHandler(){
      var thumb_wrap = document.querySelectorAll('.thumb_wrap');
      $(thumb_wrap).each(function(){
        var preview_btn = $(this).find('.preview button');
        var timestamp = $(this).attr('data-timestamp');

        preview_btn.unbind();

        preview_btn.click(function () {
          var modal = document.createElement('div');
          $(modal).addClass('spliceModal');
          $('body').append(modal);
          $(modal).on('mousedown', closeModal);
          $(modal).on('mouseup', killDrags);

          var preview_wrap = document.createElement('div');
          $(preview_wrap).addClass('preview_wrap');
          $(preview_wrap).attr('data-timestamp', timestamp);
          $(preview_wrap).on('mouseup', killDrags);
          $(modal).append(preview_wrap);

          //use whole image, draw red lines to show breaks
          // $(preview_btn).parents('.thumb_wrap').find('img.thumb').each(function () {
          var img = document.createElement('img');
          img.src = $(preview_btn).parents('.thumb_wrap').data('src');

          $(img).on('mousedown click', function (e) {
            e.stopPropagation();
          });
          $('.preview_wrap').append(img);
          // });
          img.onload = function(e) {
            //e.target = img --> e.target.width is current width relative to window
            var fullsize = $(thumb_wrap).data('fullsize');
            var currentsize = {'w':e.target.width,'h':e.target.height};
            var ratio = currentsize.w/fullsize.w;

            //create red lines and append
            var splice = $(preview_btn).parents('.thumb_wrap').data('splice');
            
            //last screen always short so don't need a line
            for(var i=0; i<splice.length-1; i++){
              var redline_wrap_offset = 5; //it's actually position of wrapper we take, so we have to minus half of its height. currently hardcoded
              var line_loc = splice[i]-redline_wrap_offset; //pixel height of line we will create
              var redline = 
                ['<div class="redline_wrap" style="top:'+(splice[i]/fullsize.h*100-redline_wrap_offset/currentsize.h*100)+'%;" data-order="'+i+'">',
                  '<div class="redline">',
                  '</div>',
                '</div>'].join('');
              $('.preview_wrap').append(redline);
            }

            $('.redline_wrap').on('click mouseout mouseup',function (e) {
              e.stopPropagation();
            }).drags();
          }
        });
      });
    }

    function resplice(timestamp){
      var thumb_wrap = $('[data-timestamp="'+timestamp+'"]');
      var blob = thumb_wrap.data('src');
      splitCanvas(blob, timestamp);
    }

    function closeModal(){
      //resplice on modal close with new redliens
      var ts = $('.spliceModal').find('.preview_wrap').attr('data-timestamp');
      resplice(ts);

      //remove modals when done
      $('.spliceModal').remove();
    };
    function killDrags(e){
      e.stopPropagation();
      $('.draggable').removeClass('draggable')
    }


    //UTILITY FUNCTIONS
    function mmToin(n, rev) {
      return rev ? n * 2.54 * 10 : (n / 10 / 2.54);
    }

        // $(document).ready(function() {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
      }
      else {
        alert('The File APIs are not fully supported in this browser.');
      }

      // Setup the dnd listeners.
      var dropZone = document.getElementsByClassName('dropzone')[0];
      dropZone.addEventListener('dragover', handleDragOver, false);
      dropZone.addEventListener('dragleave', handleDragLeave, false);
      dropZone.addEventListener('drop', handleFileDrop, false);
      dropZone.addEventListener('change', handleFileDrop, false);

      $('button.setsize').click(setSize);
      $('button.makepdf').click(makekit);
      rebindConfig();
      rebindThumbHandlers();

      $(document).on('keyup', function (e) {
        if (e.keyCode == 27) {
          closeModal();
        }
      });
    // });
  }
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);