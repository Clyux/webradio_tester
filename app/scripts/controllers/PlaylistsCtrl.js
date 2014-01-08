'use strict';

/* global _ */

/* Playlists Controller */

angular.module('septWebRadioControllers')
  .controller('PlaylistsCtrl',
    ['$scope', '$routeParams', 'playlistServices', 'userServices', 'soundCloudServices', '$timeout',
      function ($scope, $routeParams, playlistServices, userServices, soundCloudServices, $timeout) {

        $scope.playlistServices = playlistServices;
        $scope.playlists = [];
        $scope.userId = undefined;
        $scope.isSameUser = false;
        $scope.selectedPlaylistId = undefined;
        $scope.playlistItems = [];

        $scope.init = function () {
          $scope.userId = $routeParams.userId;
          $scope.isSameUser = userServices.isSameUser($scope.userId);
          $scope.initPageTitle('Playlists');
          $scope.playlistServices.getUserPlaylists($scope.userId, function (playlists) {
            $scope.playlists = playlists;
          });
        };

        $scope.selectPlaylist = function (playlistId) {
          if (playlistId === $scope.selectedPlaylistId) {
            return;
          }

          $scope.isLoading = true;
          $scope.playlistItems = [];
          $scope.selectedPlaylistId = playlistId;

          var trackIds = playlistServices.getTrackIds(playlistId);
          if (trackIds === undefined || trackIds === '' || _.size(trackIds) === 0) {
            $scope.isLoading = false;
          } else {
            soundCloudServices.getTracks(trackIds).then(function (soundCloudItems) {
              // Just for the beauty.
              $timeout(function () {
                $scope.isLoading = false;
                // Update the items with the position provided by the backend.
                $scope.playlistItems = playlistServices.mergeItemPositions(playlistId, soundCloudItems);
              }, 200);
            });
          }
        };

        $scope.moveItem = function (positionFrom, positionTo) {
          $scope.playlistServices.updateMusicPositions($scope.selectedPlaylistId, positionFrom, positionTo);
        };
      }
    ]
  );
