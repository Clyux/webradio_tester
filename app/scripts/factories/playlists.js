'use strict';

/* Page Factory */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('Playlists',
    ['$resource',
      function ($resource) {
        return $resource('/api/:userId/playlists/:playlistId', {userId: '@userId', playlistId: '@_id'},
          {update: {method: 'PUT'}}
        );
      }
    ]
  );