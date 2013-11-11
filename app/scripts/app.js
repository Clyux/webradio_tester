'use strict';

angular.module('septWebRadioApp', [
  'ngRoute',
  'septWebRadioControllers',
  'ui.bootstrap'
]);

angular.module('septWebRadioApp').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/index', {
      templateUrl: 'views/main/main.html'
    })
    .when('/stage', {
      templateUrl: 'views/stage/stage.html',
      controller: 'StageCtrl'
    })
    .when('/replay', {
      templateUrl: 'views/replay/replay.html',
      controller: 'ReplayCtrl'
    })
    .when('/topical', {
      templateUrl: 'views/topical/topical.html',
      controller: 'TopicalCtrl'
    })
    .when('/door', {
      templateUrl: 'views/door/door.html',
      controller: 'DoorCtrl'
    })
    .when('/backstage', {
      templateUrl: 'views/backstage/backstage.html',
      controller: 'BackstageCtrl'
    })
    .otherwise({
      redirectTo: '/index'
    });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
}]
);
