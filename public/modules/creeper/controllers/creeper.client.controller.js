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