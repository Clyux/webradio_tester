'use strict';

/* Controllers */

var appControllers = angular.module('septWebRadioControllers', []);

appControllers.controller('MainCtrl', ['$scope',
  function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]
);

appControllers.controller('StageCtrl', ['$scope',
  function ($scope) {
    $scope.title = 'Stage';
  }]
);

appControllers.controller('ReplayCtrl', ['$scope',
  function ($scope) {
    $scope.title = 'Replay';
  }]
);

appControllers.controller('TopicalCtrl', ['$scope',
  function ($scope) {
    $scope.title = 'Topical';
  }]
);

appControllers.controller('DoorCtrl', ['$scope',
  function ($scope) {
    $scope.title = 'Door';
  }]
);

appControllers.controller('BackstageCtrl', ['$scope',
  function ($scope) {
    $scope.title = 'Back Stage';
  }]
);
