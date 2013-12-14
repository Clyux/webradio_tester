'use strict';

/* global _ */

/* Stage Controller */

angular.module('septWebRadioControllers')
  .controller('StageCtrl', ['$scope', 'soundcloudSearch', 'utilities', '$modal', '$log', 'Playlists', 'growl', '$rootScope', 'playlistServices',
    function ($scope, soundcloudSearch, utilities, $modal, $log, Playlists, growl, $rootScope, playlistServices) {
      $scope.isSearching = false;
      $scope.searchedTerm = undefined;
      $scope.searchedItems = [];
      $scope.playlists = [];
      $scope.selectedPlaylistIds = [];
      $scope.selectedItemIds = [];
      $scope.isSingleDragAndDrop = false;
      var self = this;

      $scope.init = function () {
        $scope.initPageTitle('Stage');

        // Then get all the playlists
        if ($scope.userServices.isConnected()) {
          // Get the playlists when going to that page.
          Playlists.query(function (playlists) {
            $scope.playlists = playlists;
          });
        }
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
        self.createOrUpdatePlaylist(itemIds);
      };

      $scope.clickOnCreateButton = function () {
        self.createOrUpdatePlaylist($scope.selectedItemIds);
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
        $scope.selectedPlaylistIds = utilities.addOrRemoveItem($scope.selectedPlaylistIds, playlistId);
      };

      $scope.toggleSelectItem = function (toggleItem) {
        // Add or remove the item id
        $scope.$apply($scope.selectedItemIds = utilities.addOrRemoveItem($scope.selectedItemIds, toggleItem));
      };

      this.createOrUpdatePlaylist = function createOrUpdatePlaylist(itemIds) {
        var selectedPlaylistsSize = _.size($scope.selectedPlaylistIds);
        if (selectedPlaylistsSize > 0) {
          // If there is something selected
          if (_.size(itemIds) > 0) {
            // Add the items to the playlist
            addItemsToPlaylist(itemIds);
          } else {
            // Just create an empty playlist
            createPlaylistModal(itemIds);
          }
        } else {
          // Just create a new playlist
          createPlaylistModal(itemIds);
        }
      };

      function addItemsToPlaylist(itemIds) {
        angular.forEach($scope.selectedPlaylistIds, function (playlistId) {
          var playlistItems = playlistServices.createPlaylistItems(itemIds);
          var playlist = playlistServices.findPlaylistById(playlistId);

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



      function createPlaylistModal(itemIds) {
        var modalInstance = $modal.open({
          templateUrl: 'createPlaylistModal.html',
          controller: function ($scope, $modalInstance, itemIds) {
            $scope.itemIds = itemIds;
            $scope.playlist = {};

            $scope.createPlaylist = function (createPlaylistForm) {
              // If the form is valid
              if (createPlaylistForm.$valid) {
                var playlistItems = playlistServices.createPlaylistItems($scope.itemIds);

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

      $rootScope.$on('SWR-DRAG-START-NUMBER', function (event, numberItems) {
        $scope.$apply($scope.isSingleDragAndDrop = numberItems === 1);
      });

      $rootScope.$on('SWR-DRAG-END-NUMBER', function () {
        $scope.$apply($scope.isSingleDragAndDrop = false);
      });
    }]
  );