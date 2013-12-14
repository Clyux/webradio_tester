'use strict';

/* Playlist Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('playlistServices', [
    function () {

      var self = this;

      this.createPlaylistItems = function createPlaylistItems(itemIds) {
        var itemsToCreate = [];
        angular.forEach(itemIds, function (itemId) {
          var itemToInsert = self.createPlaylistItem(itemId);
          itemsToCreate.push(itemToInsert);
        });
        return itemsToCreate;
      };

      this.createPlaylistItem = function createPlaylistItem(itemId) {
        return {
          provider: 'soundcloud',
          musicId: itemId
        };
      };

      this.findPlaylistById = function findPlaylistById(playlistId) {
        var playlistFound;
        angular.forEach($scope.playlists, function (playlist) {
          if (playlist._id === playlistId) {
            playlistFound = playlist;
            return;
          }
        });
        return playlistFound;
      };

    }
  ]);
