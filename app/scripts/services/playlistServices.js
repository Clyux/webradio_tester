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
    }
  ]);
