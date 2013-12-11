'use strict';

/* global _ */

/* Stage Controller */

angular.module('septWebRadioControllers')
  .controller('StageCtrl', ['$scope', 'soundcloudSearch', 'utilities', '$modal', '$log', 'Page', 'Playlists', 'growl', '$rootScope',
    function ($scope, soundcloudSearch, utilities, $modal, $log, Page, Playlists, growl, $rootScope) {
      $scope.isSearching = false;
      $scope.searchedTerm = undefined;
      $scope.searchedItems = [];
      $scope.playlists = [];
      $scope.selectedPlaylistIds = [];
      $scope.selectedItemIds = [];
      $scope.isSingleDragAndDrop = false;
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
        var itemIds = angular.copy(droppedItems);
        createOrUpdatePlaylist(itemIds);
      };

      $scope.clickOnCreateButton = function () {
        createOrUpdatePlaylist($scope.selectedItemIds);
      };

      $scope.getButtonLabel = function () {
        var selectedPlaylistsSize = _.size($scope.selectedPlaylistIds);
        var selectedItemssSize = _.size($scope.selectedItemIds);

        var label = '';

        if ($scope.isSingleDragAndDrop) {
          selectedItemssSize = 1;
        }

        if (selectedPlaylistsSize > 0) {
          // We have some playlists selected
          if (selectedItemssSize > 0) {
            label = 'Add ' + selectedItemssSize;
            if (selectedItemssSize === 1) {
              label += ' item ';
            } else if (selectedItemssSize > 1) {
              label += ' items ';
            }

            // Then add the number of playlist
            label += ' to ' + selectedPlaylistsSize;
            if (selectedPlaylistsSize === 1) {
              label += ' playlist';
            } else {
              label += ' playlists';
            }
          } else {
            label = 'Create a new playlist';
          }
        } else {
          if (selectedItemssSize > 0) {
            // There is no selected playlist
            label = 'Create a new playlist with ' + selectedItemssSize;
            if (selectedItemssSize === 1) {
              label += ' item';
            } else if (selectedItemssSize > 1) {
              label += ' items';
            }
          } else {
            label = 'Create a new playlist';
          }
        }

        return label;
      };

      $scope.togglePlaylist = function (playlistId) {
        // Add or remove the playlist id
        $scope.selectedPlaylistIds = addOrRemoveItem($scope.selectedPlaylistIds, playlistId);
      };

      $scope.toggleSelectItem = function (toggleItem) {
        // Add or remove the item id
        $scope.$apply($scope.selectedItemIds = addOrRemoveItem($scope.selectedItemIds, toggleItem));
      };

      function addOrRemoveItem(list, item) {
        if (_.indexOf(list, item) === -1) {
          list.push(item);
        } else {
          // Else, we remove it
          list = _.without(list, item);
        }
        return list;
      }

      function createOrUpdatePlaylist(itemIds) {
        var selectedPlaylistsSize = _.size($scope.selectedPlaylistIds);
        if (selectedPlaylistsSize > 0) {
          addItemsToPlaylist(itemIds);
        } else {
          createPlaylistModal(itemIds);
        }
      }

      function addItemsToPlaylist(itemIds) {
        angular.forEach($scope.selectedPlaylistIds, function (playlistId) {
          var playlistItems = createPlaylistItems(itemIds);
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
              growl.addSuccessMessage(_.size(itemIds) + ' items has been added to the playlist: ' + playlist.name);
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

      function createPlaylistModal(itemIds) {
        var modalInstance = $modal.open({
          templateUrl: 'createPlaylistModal.html',
          controller: function ($scope, $modalInstance, itemIds) {
            $scope.itemIds = itemIds;
            $scope.playlist = {};

            $scope.createPlaylist = function (createPlaylistForm) {
              // If the form is valid
              if (createPlaylistForm.$valid) {
                var playlistItems = createPlaylistItems($scope.itemIds);

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
            itemIds: function () {
              return itemIds;
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

      function createPlaylistItems(itemIds) {
        var itemsToCreate = [];
        angular.forEach(itemIds, function (itemId) {
          var itemToInsert = createPlaylistItem(itemId);
          itemsToCreate.push(itemToInsert);
        });
        return itemsToCreate;
      }

      function createPlaylistItem(itemId) {
        return {
          provider: 'soundcloud',
          musicId: itemId
        };
      }

      $rootScope.$on('SWR-DRAG-START-NUMBER', function (event, numberItems) {
        $scope.$apply($scope.isSingleDragAndDrop = numberItems === 1);
      });

      $rootScope.$on('SWR-DRAG-END-NUMBER', function () {
        $scope.$apply($scope.isSingleDragAndDrop = false);
      });
    }]
  );