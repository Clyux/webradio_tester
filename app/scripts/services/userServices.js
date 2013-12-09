'use strict';

/* User Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('userServices', ['$http', '$window',
    function ($http, $window) {
      var self = this;
      this.user = JSON.parse($window.windowsUser);

      this.getUser = function () {
        return self.user;
      };

      this.isConnected = function () {
        return self.user !== undefined;
      };

      this.signUp = function (user) {
        $http.post('/users', user)
          .success(function (data) {
            if (data.error) {
              self.user = undefined;
            } else {
              self.user = data.user;
            }
            console.log(data);
          })
          .error(function (data) {
            console.log('error' + data);
          });
      };

      this.logIn = function (user) {
        $http.post('/users/session', user)
          .success(function (data) {
            if (data.error) {
              self.user = undefined;
            } else {
              self.user = data.user;
            }
          })
          .error(function (data) {
            console.log('error' + data);
          });
      };

      this.logOut = function () {
        $http.get('/signout')
          .success(function () {
            self.user = undefined;
          })
          .error(function (data) {
            console.log('error' + data);
          });
      };
    }]
  );
