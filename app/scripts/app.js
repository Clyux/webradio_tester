'use strict';

angular.module('septWebRadioApp', [
  'ngRoute',
  'ngAnimate',
  'ngCookies',
  'ui.bootstrap',
  'septWebRadioControllers',
  'septWebRadioDirectives',
  'septWebRadioFactories',
  'wu.masonry'
]);

angular.module('septWebRadioApp')
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/index', {
          templateUrl: 'views/main/main.html',
          controller: 'IndexCtrl'
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
        .when('/login', {
          templateUrl: 'views/sign/in.html',
          controller: 'SignCtrl'
        })
        .when('/signup', {
          templateUrl: 'views/sign/up.html',
          controller: 'SignCtrl'
        })
        .otherwise({
          redirectTo: '/index'
        });

      $locationProvider.html5Mode(true);
    }]
  );
