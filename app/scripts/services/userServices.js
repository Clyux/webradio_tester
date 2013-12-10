'use strict';

/* User Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('userServices', ['$http', '$window', '$location', 'growl',
    function ($http, $window, $location, growl) {
      var self = this;

      this.user = undefined;

      try {
        self.user = JSON.parse($window.windowsUser);
        if (self.user === null) {
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

      this.getName = function () {
        if (self.user) {
          return self.user.username;
        } else {
          return '';
        }
      };

      this.signUp = function (user) {
        $http.post('/users', user)
          .success(function (data) {
            if (data.error) {
              console.log(data);
              self.user = undefined;

              switch (data.error.errorCode) {
                case 11000:
                  growl.addErrorMessage('The username or email is not available!');
                  break;
                default:
                  growl.addErrorMessage('Error when Sign Up!');
                  break;
              }
            } else {
              self.user = data.user;
              $location.path('/stage');
              growl.addSuccessMessage('Account successfully created!');
            }
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
              growl.addErrorMessage('Error when connecting: ' + data.error.message);
            } else {
              self.user = data.user;
              $location.path('/stage');
              growl.addSuccessMessage('Successfully connected!');
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
            growl.addSuccessMessage('Successfully disconnected!');
          })
          .error(function (data) {
            console.log('error' + data);
          });
      };
    }]
  );
