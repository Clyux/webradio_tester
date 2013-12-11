'use strict';

/* global _ */

/* Stage Controller */

angular.module('septWebRadioControllers')
  .controller('StageCtrl', ['$scope', 'soundcloudSearch', 'utilities', '$modal', '$log', 'Page', 'Playlists', 'growl',
    function ($scope, soundcloudSearch, utilities, $modal, $log, Page, Playlists, growl) {
      $scope.isSearching = false;
      $scope.searchedTerm = undefined;
      $scope.searchedItems = [];
      $scope.playlists = [];
      $scope.selectedPlaylistIds = [];
      Page.setTitle('Stage');

      $scope.findAllPlaylists = function () {
        // Get the playlists when going to that page.
        Playlists.query(function (playlists) {
          $scope.playlists = playlists;
        });
      };

      $scope.search = function () {
        // If there is a term to search
        if ($scope.searchedTerm && $scope.searchedTerm !== '' && $scope.searchedTerm.length >= 2) {
          $scope.isSearching = true;

          // Search the terms
          soundcloudSearch.autoCompleteSearch($scope.searchedTerm)
            .then(function (response) {
              $scope.searchedItems = utilities.unionWithId($scope.searchedItems, response);
              $scope.isSearching = false;
            });
        } else {
          // There is nothing to search
          $scope.isSearching = false;
          $scope.searchedItems.splice(0, $scope.searchedItems.length);
        }
      };

      $scope.dropped = function (droppedItems) {
        var scopeItems = [];

        angular.forEach(droppedItems, function (valueId) {
          valueId = parseInt(valueId);
          var item = _.find($scope.searchedItems, function (listItem) {
            return valueId === parseInt(listItem.id);
          });

          this.push(item);
        }, scopeItems);

        createOrUpdatePlaylist(scopeItems);
      };

      $scope.clickOnCreateButton = function () {

      };

      $scope.getButtonLabel = function () {
        var selectedPlaylistsSize = _.size($scope.selectedPlaylistIds);
        if (selectedPlaylistsSize === 1) {
          return 'Add to ' + selectedPlaylistsSize + ' playlist';
        } else if (selectedPlaylistsSize > 1) {
          return 'Add to ' + selectedPlaylistsSize + ' playlists';
        } else {
          return 'Create a playlist';
        }
      };

      $scope.togglePlaylist = function (playlistId) {
        // If the playlist is not here, we add it
        if (_.indexOf($scope.selectedPlaylistIds, playlistId) === -1) {
          $scope.selectedPlaylistIds.push(playlistId);
        } else {
          // Else, we remove it
          $scope.selectedPlaylistIds = _.without($scope.selectedPlaylistIds, playlistId);
        }
      };

      function createOrUpdatePlaylist(items) {
        var selectedPlaylistsSize = _.size($scope.selectedPlaylistIds);
        if (selectedPlaylistsSize > 0) {
          addItemsToPlaylist(items);
        } else {
          createPlaylist(items);
        }
      }

      function addItemsToPlaylist(items) {
        angular.forEach($scope.selectedPlaylistIds, function (playlistId) {
          var playlistItems = createPlaylistItems(items);
          var playlist = findPlaylist(playlistId);

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
              growl.addSuccessMessage(_.size(items) + ' items has been added to the playlist: ' + playlist.name);
            });
          } else {
            growl.addErrorMessage('You have to select a valid playlist!');
          }
        });
      }

      function findPlaylist(id) {
        var playlistFound;
        angular.forEach($scope.playlists, function (playlist) {
          if (playlist._id === id) {
            playlistFound = playlist;
            return;
          }
        });
        return playlistFound;
      }

      function createPlaylist(items) {
        var modalInstance = $modal.open({
          templateUrl: 'createPlaylistModal.html',
          controller: function ($scope, $modalInstance, items) {
            $scope.items = items;
            $scope.playlist = {};

            $scope.createPlaylist = function (createPlaylistForm) {
              // If the form is valid
              if (createPlaylistForm.$valid) {

                var playlistItems = createPlaylistItems(items);

                var playlist = new Playlists({
                  name: $scope.playlist.name,
                  items: playlistItems
                });

                playlist.$save(function (response) {
                  $modalInstance.close(response);
                });
              }
            };
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          },
          resolve: {
            items: function () {
              return items;
            }
          }
        });

        modalInstance.result.then(
          function (savedPlaylist) {
            $scope.playlists.push(savedPlaylist);
            growl.addSuccessMessage('Playlist successfully created!');
          }
        );
      }

      function createPlaylistItems(items) {
        var itemsToCreate = [];
        angular.forEach(items, function (item) {
          var itemToInsert = createPlaylistItem(item);
          itemsToCreate.push(itemToInsert);
        });
        return itemsToCreate;
      }

      function createPlaylistItem(item) {
        return {
          provider: 'soundcloud',
          musicId: item.id
        };
      }
    }]
  );