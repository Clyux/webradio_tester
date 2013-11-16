'use strict';

/* global SC */

/* Services */

angular.module('septWebRadioServices', []);

angular.module('septWebRadioServices')
  .service('applicationServices', ['$http', '$q', '$cookieStore', 'soundCloudServices',
    function ($http, $q, $cookieStore, soundCloudServices) {

      var clientId = '';
      var redirectUri = '';

      this.getInitApplication = function () {

        var token = $cookieStore.get('SC_Token');

        var initAppPromise = $http.get('init_application').
          success(function (result) {
            clientId = result.clientId;
            redirectUri = result.url;

            /*jshint camelcase: false */

            // Init the SC Api.
            SC.initialize({
              client_id: clientId,
              redirect_uri: redirectUri,
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
    }]
  )
  .service('soundCloudServices', ['$http', '$q', '$cookieStore',
    function ($http, $q, $cookieStore) {

      var self = this;

      var soundCloudToken;
      var soundCloudUser;

      this.getConnexionLabel = function () {
        if (self.isConnected()) {
          return 'Log Out';
        } else {
          return 'Log In';
        }
      };

      this.isConnected = function () {
        if (soundCloudUser) {
          return true;
        } else {
          return false;
        }
      };

      this.logInLogOut = function () {
        // Create the promise
        var deferred = $q.defer();

        // Get the promise object
        var promise = deferred.promise;

        if (soundCloudUser) {
          soundCloudToken = undefined;
          soundCloudUser = undefined;

          $cookieStore.remove('SC_Token');
          $cookieStore.remove('SC_User');

          deferred.resolve('disconnect');

          return promise;
        } else {
          // Log the user
          // Call the SoundCloud api in order to connect via OAuth2
          SC.connect(function () {
            soundCloudToken = SC.accessToken();
            $cookieStore.put('SC_Token', soundCloudToken);
            deferred.resolve(soundCloudToken);
          });

          return promise.then(function () {
            return self.me();
          });
        }
      };

      this.me = function () {
        // Create the promise
        var deferred = $q.defer();

        // Call the SoundCloud api in order to get the user
        SC.get('/me', function (response) {
          soundCloudUser = response;
          $cookieStore.put('SC_User', soundCloudUser);
          deferred.resolve(soundCloudUser);
        });

        // Get the promise object
        var promise = deferred.promise;

        promise.then(function (response) {
          return response;
        });

        // And return the promise object
        return promise;
      };
    }]
  )
  .service('soundcloudSearch', ['$http', '$q', 'limitToFilter',
    function ($http, $q, limitToFilter) {

      this.autoCompleteSearch = function ($search) {
        // Create the promise
        var deferred = $q.defer();

        SC.get('/tracks', { q: $search }, function(response) {
          var tracks = limitToFilter(response, 5);
          deferred.resolve(tracks);
        });

        // Get the promise object
        var promise = deferred.promise;
        promise.then(function (response) {
          return response;
        });
        // And return the promise object
        return promise;
      };
    }]
  );
