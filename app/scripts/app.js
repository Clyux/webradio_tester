'use strict';

angular.module('septWebRadioApp', [
  'ngRoute',
  'ngAnimate',
  'ngCookies',
  'ui.bootstrap',
  'septWebRadioControllers',
  'septWebRadioDirectives',
  'septWebRadioFactories',
  'wu.masonry',
  'angular-growl'
]);

angular.module('septWebRadioApp')
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/index', {
          templateUrl: 'partials/main/main.html',
          controller: 'IndexCtrl'
        })
        .when('/stage', {
          templateUrl: 'partials/stage/stage.html',
          controller: 'StageCtrl'
        })
        .when('/replay', {
          templateUrl: 'partials/replay/replay.html',
          controller: 'ReplayCtrl'
        })
        .when('/topical', {
          templateUrl: 'partials/topical/topical.html',
          controller: 'TopicalCtrl'
        })
        .when('/door', {
          templateUrl: 'partials/door/door.html',
          controller: 'DoorCtrl'
        })
        .when('/backstage', {
          templateUrl: 'partials/backstage/backstage.html',
          controller: 'BackstageCtrl'
        })
        .when('/login', {
          templateUrl: 'partials/sign/in.html',
          controller: 'SignCtrl'
        })
        .when('/signup', {
          templateUrl: 'partials/sign/up.html',
          controller: 'SignCtrl'
        })
        .otherwise({
          redirectTo: '/index'
        });

      $locationProvider.html5Mode(true);
    }]
  )
  .config(['growlProvider',
    function (growlProvider) {
      growlProvider.globalTimeToLive(4000);
      growlProvider.onlyUniqueMessages(true);
    }]
  );