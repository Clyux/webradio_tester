'use strict';

/* global SC */

/* Sound CLoud Search Service */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('soundcloudSearch', ['$http', '$q',
    function ($http, $q) {

      var self = this;
      this.searching = false;
      this.deferred = undefined;

      this.autoCompleteSearch = function ($search) {

        if (self.searching){
          self.deferred.reject();
        }

        self.searching = true;

        // Create the promise
        self.deferred = $q.defer();

        SC.get('/tracks', { q: $search }, function (response) {
          self.deferred.resolve(response);
          self.searching = false;
        });

        // Get the promise object
        var promise = self.deferred.promise;
        promise.then(function (response) {
          return response;
        });
        // And return the promise object
        return promise;
      };
    }]
  );
