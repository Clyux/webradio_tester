'use strict';

/* global SC */

/* Sound Cloud Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('soundCloudServices', ['$http', '$q', '$cookieStore',
    function ($http, $q, $cookieStore) {

      var self = this;
      this.soundCloudToken = undefined;
      this.soundCloudUser = undefined;
      this.meDeferred = undefined;
      this.getTracksDeferred = undefined;

      this.getUser = function () {
        return self.soundCloudUser;
      };

      this.isConnected = function () {
        if (self.soundCloudUser) {
          return true;
        } else {
          return false;
        }
      };

      this.logIn = function () {
        // Create the promise
        var deferred = $q.defer();

        // Get the promise object
        var promise = deferred.promise;

        // Log the user
        // Call the SoundCloud api in order to connect via OAuth2
        SC.connect(function () {
          self.soundCloudToken = SC.accessToken();
          $cookieStore.put('SC_Token', self.soundCloudToken);
          deferred.resolve(self.soundCloudToken);
        });

        return promise.then(function () {
          return self.me();
        });
      };

      this.logOut = function () {
        // Create the promise
        var deferred = $q.defer();

        // Get the promise object
        var promise = deferred.promise;

        self.soundCloudToken = undefined;
        self.soundCloudUser = undefined;

        $cookieStore.remove('SC_Token');
        $cookieStore.remove('SC_User');

        deferred.resolve();

        return promise;
      };

      this.me = function () {
        // Create the promise
        self.meDeferred = $q.defer();

        // Call the SoundCloud api in order to get the user
        SC.get('/me', self.meCallBack);

        // Get and return the promise object
        return self.meDeferred.promise;
      };

      this.meCallBack = function (response) {
        self.soundCloudUser = response;
        $cookieStore.put('SC_User', self.soundCloudUser);
        self.meDeferred.resolve(self.soundCloudUser);
      };

      this.getTracks = function (trackIds) {
        // Create the promise
        self.getTracksDeferred = $q.defer();

        var trackIdsStr = trackIds.join(',');

        // Call the SoundCloud api in order to get the user
        SC.get('/tracks', { ids: trackIdsStr }, self.getTracksCallBack);

        // Get and return the promise object
        return self.getTracksDeferred.promise;
      };

      this.getTracksCallBack = function (response) {
        self.getTracksDeferred.resolve(response);
      };
    }]
  );
