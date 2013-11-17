'use strict';

/* global SC */

/* Application Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('applicationServices', ['$http', '$q', '$cookieStore', 'soundCloudServices',
    function ($http, $q, $cookieStore, soundCloudServices) {

      this.clientId = '';
      this.redirectUri = '';
      var self = this;

      this.getInitApplication = function () {
        var token = $cookieStore.get('SC_Token');

        var initAppPromise = $http.get('init_application').
          success(function (result) {
            self.clientId = result.clientId;
            self.redirectUri = result.url;

            /*jshint camelcase: false */

            // Init the SC Api.
            SC.initialize({
              client_id: self.clientId,
              redirect_uri: self.redirectUri,
              access_token: token,
              scope: 'non-expiring'
            });
          });

        return initAppPromise.then(function () {
          if (token) {
            // Get the user info.
            return soundCloudServices.me()
              .then(function (user) {
                return user;
              });
          } else {
            return undefined;
          }
        });
      };

      this.isConnected = function () {
        return soundCloudServices.isConnected();
      };

      this.getConnexionLabel = function () {
        if (self.isConnected()) {
          return 'Log Out';
        } else {
          return 'Log In';
        }
      };

      this.logInLogOut = function () {
        var promise;

        if (self.isConnected()) {
          promise = soundCloudServices.logOut();
        } else {
          promise = soundCloudServices.logIn();
        }

        return promise.then(function () {
          return self.getConnexionLabel();
        });
      };
    }]
  );
