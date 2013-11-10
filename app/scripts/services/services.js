'use strict';

/* Services */

angular.module('septWebRadioServices', []);

/*angular.module('septWebRadioServices', ['$provide', '$http'], function ($provide, $http) {
 $provide.factory('getAppUrl', ['', function () {
 return $http.get('get_app_url').then(function (result) {
 return result.data;
 });
 }]);
 });*/

angular.module('septWebRadioServices').service('initApplication', ['$http',
  function ($http) {
    return $http.get('init_application').then(function (result) {
      return result.data;
    });
  }]
);