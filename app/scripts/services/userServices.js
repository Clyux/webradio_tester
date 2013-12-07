'use strict';

/* User Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('userServices', ['$http',
    function ($http) {

      var self = this;

      this.signUp = function (user) {
        $http.post('/users', user)
          .success(function (data) {
            console.log(data);
          })
          .error(function (data, status) {
            console.log('error' + data);
          });
      };

      this.logIn = function (user) {
        $http.post('/users/session', user)
          .success(function (data) {
            console.log(data);
          })
          .error(function (data, status) {
            console.log('error' + data);
          });
      };
    }]
  );
