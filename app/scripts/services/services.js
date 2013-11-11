'use strict';

/* global DZ */

/* Services */

angular.module('septWebRadioServices', []);

angular.module('septWebRadioServices')
  .service('initApplication', ['$http',
    function ($http) {
      this.getInitApplication = function () {
        return $http.get('init_application').then(function (result) {
          return result.data;
        });
      };
    }]
  ).service('deezerSearch', ['$http', '$q', 'limitToFilter',
    function ($http, $q, limitToFilter) {
      this.autoCompleteSearch = function ($search) {
        // Create the promise
        var deferred = $q.defer();

        // Call the deezer api in order to search
        DZ.api('/search/autocomplete?q=' + $search, function (response) {
          // Get just the 5 first tracks
          var tracks = limitToFilter(response.tracks.data, 5);
          deferred.resolve(tracks);
        });

        // Get the promise object
        var promise = deferred.promise;
        promise.then(function(response) {
          return response;
        });
        // And return the promise object
        return promise;
      };
    }]
  );
