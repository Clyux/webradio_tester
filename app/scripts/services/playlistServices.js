'use strict';

/* global _ */

/* Playlist Services */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('playlistServices', ['Playlists', 'swrNotification', '$modal', '$cacheFactory',
    function (Playlists, swrNotification, $modal, $cacheFactory) {

      var self = this;
      this.playlists = undefined;
      this.cache = $cacheFactory('playlistServices');

      this.getPlaylists = function () {
        return self.playlists;
      };

      this.initPlaylists = function () {
        self.playlists = self.cache.get('playlists');
        if (!self.playlists) {
          // Get all the playlists
          Playlists.query(function (playlists) {
            self.playlists = playlists;
            self.cache.put('playlists', playlists);
          });
        }
      };

      this.createPlaylistItems = function (itemIds) {
        var itemsToCreate = [];
        angular.forEach(itemIds, function (itemId) {
          var itemToInsert = self.createPlaylistItem(itemId);
          itemsToCreate.push(itemToInsert);
        });
        return itemsToCreate;
      };

      this.createPlaylistItem = function (itemId) {
        return {
          provider: 'soundcloud',
          musicId: itemId
        };
      };

      this.findPlaylistById = function (playlistId) {
        var playlistFound;
        angular.forEach(self.playlists, function (playlist) {
          if (playlist._id === playlistId) {
            playlistFound = playlist;
            return;
          }
        });
        return playlistFound;
      };

      this.createOrUpdatePlaylist = function (playlistIds, itemIds) {
        var selectedPlaylistsSize = _.size(playlistIds);
        if (selectedPlaylistsSize > 0) {
          // If there is something selected
          if (_.size(itemIds) > 0) {
            // Add the items to the playlists
            self.addItemsToPlaylists(playlistIds, itemIds);
          } else {
            // Just create an empty playlist
            self.createPlaylistModal(itemIds);
          }
        } else {
          // Just create a new playlist
          self.createPlaylistModal(itemIds);
        }
      };

      this.createPlaylistWithItems = function (playlistName, itemIds, done) {
        var playlistItems = self.createPlaylistItems(itemIds);
        var playlist = new Playlists({
          name: playlistName,
          items: playlistItems
        });
        playlist.$save(function (response) {
          if (angular.isUndefined(self.playlists)) {
            self.playlists = [];
          }
          self.playlists.push(response);
          swrNotification.message('Playlist successfully created!');
          done(response);
        });
      };

      this.addItemsToPlaylists = function (playlistIds, itemIds) {
        angular.forEach(playlistIds, function (playlistId) {
          self.addItemsToPlaylist(playlistId, itemIds);
        });
      };

      this.addItemsToPlaylist = function (playlistId, itemIds) {
        var playlist = self.findPlaylistById(playlistId);
        var playlistItems = self.createPlaylistItems(itemIds);

        if (playlist !== undefined) {
          if (!playlist.items) {
            playlist.items = [];
          }
          angular.forEach(playlistItems, function (playlistItem) {
            playlist.items.push(playlistItem);
          });

          playlist.$update(function (response) {
            playlist = response;
            // Update the model
            var itemSize = _.size(itemIds);
            if (itemSize === 1) {
              swrNotification.message(itemSize + ' music has been added');
            } else {
              swrNotification.message(itemSize + ' musics have been added');
            }
          });
        } else {
          swrNotification.error('You have to select a valid playlist!');
        }
      };

      this.createPlaylistModal = function (itemIds) {
        $modal.open({
          templateUrl: 'createPlaylistModal.html',
          controller: function ($scope, $modalInstance, itemIds) {
            $scope.itemIds = itemIds;
            $scope.playlist = {};

            $scope.createPlaylist = function (createPlaylistForm) {
              // If the form is valid
              if (createPlaylistForm.$valid) {
                self.createPlaylistWithItems($scope.playlist.name, $scope.itemIds, function (response) {
                  $modalInstance.close(response);
                });
              }
            };
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          },
          resolve: {
            itemIds: function () {
              return itemIds;
            }
          }
        });
      };
    }
  ]);
