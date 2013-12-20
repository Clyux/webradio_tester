'use strict';

/* User Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('userServices', ['$http', '$window', '$location', 'swrNotification',
    function ($http, $window, $location, swrNotification) {
      var self = this;
      this.user = undefined;

      this.init = function () {
        try {
          self.user = JSON.parse($window.windowsUser);
          if (self.user === null) {
            self.user = undefined;
          }
        } catch (e) {
          self.user = undefined;
        }
      };

      this.getUser = function () {
        return self.user;
      };

      this.isConnected = function () {
        return !angular.isUndefined(self.user);
      };

      this.getName = function () {
        if (self.user) {
          return self.user.username;
        } else {
          return '';
        }
      };

      this.isSameUser = function (username) {
        if (self.user) {
          return self.user.username === username;
        } else {
          return false;
        }
      };

      this.signUp = function (user) {
        $http.post('/users', user)
          .success(function (data) {
            if (data.error) {
              self.user = undefined;

              switch (data.error.errorCode) {
                case 11000:
                  swrNotification.error('The username or email is not available!');
                  break;
                default:
                  swrNotification.error('Error when Sign Up!');
                  break;
              }
            } else {
              self.user = data.user;
              $location.path('/stage');
              swrNotification.message('Account successfully created!');
            }
          });
      };

      this.logIn = function (user) {
        $http.post('/users/session', user)
          .success(function (data) {
            if (data.error) {
              self.user = undefined;
              swrNotification.error('Error when connecting: ' + data.error.message);
            } else {
              self.user = data.user;
              $location.path('/stage');
              swrNotification.message('Successfully connected!');
            }
          });
      };

      this.logOut = function () {
        $http.get('/signout')
          .success(function () {
            self.user = undefined;
            swrNotification.message('Successfully disconnected!');
          });
      };
    }]
  );
