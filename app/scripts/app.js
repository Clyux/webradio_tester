'use strict';

var septWebRadioApp = angular.module('septWebRadioApp', [
  'ngRoute',
  'septWebRadioControllers'
]);

septWebRadioApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
        redirectTo: '/'
      });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
});
