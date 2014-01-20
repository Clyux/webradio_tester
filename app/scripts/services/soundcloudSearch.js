'use strict';

/* global SC */

/* Sound CLoud Search Service */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('soundcloudSearch', ['$http', '$q', 'limitToFilter',
    function ($http, $q, limitToFilter) {

      var self = this;
      this.searching = false;
      this.deferred = undefined;
      this.maxItems = 25;

      this.autoCompleteSearch = function ($search) {
        if (self.searching) {
          self.deferred.reject();
        }

        self.searching = true;

        // Create the promise
        self.deferred = $q.defer();

        SC.get('/tracks', { q: $search }, self.resolveGetTracks);

        // Get and return the promise object
        return self.deferred.promise;
      };

      this.resolveGetTracks = function (response) {
        self.deferred.resolve(limitToFilter(response, self.maxItems));
        self.searching = false;
      };
    }]
  );
