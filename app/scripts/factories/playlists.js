'use strict';

/* Page Factory */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('Playlists',
    ['$resource',
      function ($resource) {
        var playlist = $resource('/api/:userId/playlists/:playlistId', {userId: '@userId', playlistId: '@_id'},
          {update: {method: 'PUT'}}
        );
        var featuredPlaylists = $resource('/api/playlists?featured=1&limit=:limit');
        playlist.getFeaturedPlaylists = featuredPlaylists.query.bind(featuredPlaylists);
        return playlist;
      }
    ]
  );