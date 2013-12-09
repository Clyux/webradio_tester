'use strict';

/* User Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('userServices', ['$http', '$window', '$location',
    function ($http, $window, $location) {
      var self = this;

      this.user = undefined;

      try {
        self.user = JSON.parse($window.windowsUser);
        if (self.user === null){
          self.user = undefined;
        }
      } catch (e) {
        self.user = undefined;
      }

      this.getUser = function () {
        return self.user;
      };

      this.isConnected = function () {
        return !angular.isUndefined(self.user);
      };

      this.signUp = function (user) {
        $http.post('/users', user)
          .success(function (data) {
            if (data.error) {
              self.user = undefined;
            } else {
              self.user = data.user;
              $location.path('/stage');
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
              $location.path('/stage');
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
