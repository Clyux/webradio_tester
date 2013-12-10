'use strict';

/* global _ */

/* Stage Controller */

angular.module('septWebRadioControllers')
  .controller('StageCtrl', ['$scope', 'soundcloudSearch', 'utilities', '$modal', '$log', 'Page',
    function ($scope, soundcloudSearch, utilities, $modal, $log, Page) {
      $scope.isSearching = false;
      $scope.searchedTerm = undefined;
      $scope.searchedItems = [];
      $scope.playlists = [
        {id: 1, title: 'Playlist 1'},
        {id: 2, title: 'Playlist 2'},
        {id: 3, title: 'Playlist 3'},
        {id: 4, title: 'Playlist 4'}
      ];
      $scope.selectedPlaylists = [];
      $scope.list1 = [];
      Page.setTitle('Stage');

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

        $scope.open(scopeItems);
      };

      $scope.togglePlaylist = function (playlistId) {
        // If the playlist is not here, we add it
        if (_.indexOf($scope.selectedPlaylists, playlistId) === -1) {
          $scope.selectedPlaylists.push(playlistId);
        } else {
          // Else, we remove it
          $scope.selectedPlaylists = _.without($scope.selectedPlaylists, playlistId);
        }
      };

      $scope.open = function (items) {
        var modalInstance = $modal.open({
          templateUrl: 'createPlaylistModal.html',
          controller: function ($scope, $modalInstance, items) {
            $scope.items = items;
            $scope.ok = function () {
              $modalInstance.close($scope.items);
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

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    }]
  );