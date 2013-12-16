'use strict';

angular.module('septWebRadioApp', [
  'ngRoute',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ui.bootstrap',
  'septWebRadioControllers',
  'septWebRadioDirectives',
  'septWebRadioFactories',
  'wu.masonry',
  'angular-growl'
]);

angular.module('septWebRadioApp')
  .config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/index', {
          templateUrl: 'partials/index/index.html',
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

      // Catch the 401 error
      var interceptor = ['$rootScope', '$q',
        function (scope, $q) {
          function success(response) {
            return response;
          }

          function error(response) {
            var status = response.status;

            if (status === 401) {
              var deferred = $q.defer();
              scope.$broadcast('event:loginRequired');
              return deferred.promise;
            }
            // otherwise
            return $q.reject(response);
          }

          return function (promise) {
            return promise.then(success, error);
          };
        }];

      $httpProvider.responseInterceptors.push(interceptor);
    }]
  )
  .config(['growlProvider',
    function (growlProvider) {
      growlProvider.globalTimeToLive(4000);
      growlProvider.onlyUniqueMessages(true);
    }]
  );