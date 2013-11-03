'use strict';

/* Controllers */

var appControllers = angular.module('septWebRadioControllers', []);

appControllers.controller('MainCtrl', ['$scope',
  function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]
);

appControllers.controller('StageCtrl', ['$scope',
  function($scope) {
  }]
);

appControllers.controller('ReplayCtrl', ['$scope',
  function($scope) {
  }]
);

appControllers.controller('TopicalCtrl', ['$scope',
  function($scope) {
  }]
);

appControllers.controller('DoorCtrl', ['$scope',
  function($scope) {
  }]
);

appControllers.controller('BackstageCtrl', ['$scope',
  function($scope) {
  }]
);
