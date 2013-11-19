'use strict';

/* global SC */

/* Sound CLoud Search Service */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('soundcloudSearch', ['$http', '$q',
    function ($http, $q) {

      this.autoCompleteSearch = function ($search) {
        // Create the promise
        var deferred = $q.defer();

        SC.get('/tracks', { q: $search }, function (response) {
          //var tracks = limitToFilter(response, 5);
          deferred.resolve(response);
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
