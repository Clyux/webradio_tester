'use strict';

/* global _ */

/* Stage Controller */

angular.module('septWebRadioControllers')
  .controller('StageCtrl', ['$scope', 'soundcloudSearch', 'utilities', '$rootScope', 'playlistServices',
    function ($scope, soundcloudSearch, utilities, $rootScope, playlistServices) {
      $scope.isSearching = false;
      $scope.searchedTerm = undefined;
      $scope.searchedItems = [];
      $scope.playlistServices = playlistServices;
      $scope.selectedPlaylistIds = [];
      $scope.selectedItemIds = [];
      $scope.isSingleDragAndDrop = false;

      $scope.init = function () {
        $scope.initPageTitle('Stage');
        // Then get all the playlists
        if ($scope.userServices.isConnected()) {
          $scope.playlistServices.initPlaylists();
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
        playlistServices.createOrUpdatePlaylist($scope.selectedPlaylistIds, itemIds);
      };

      $scope.clickOnCreateButton = function () {
        playlistServices.createOrUpdatePlaylist($scope.selectedPlaylistIds, $scope.selectedItemIds);
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
              label += ' item';
            } else if (selectedItemssSize > 1) {
              label += ' items';
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
        utilities.addOrRemoveItem($scope.selectedPlaylistIds, playlistId);
      };

      $scope.toggleSelectItem = function (toggleItem) {
        // Add or remove the item id
        $scope.$apply(utilities.addOrRemoveItem($scope.selectedItemIds, toggleItem));
      };

      $rootScope.$on('SWR-DRAG-START-NUMBER', function (event, numberItems) {
        $scope.$apply($scope.isSingleDragAndDrop = numberItems === 1);
      });

      $rootScope.$on('SWR-DRAG-END-NUMBER', function () {
        $scope.$apply($scope.isSingleDragAndDrop = false);
      });
    }]
  );