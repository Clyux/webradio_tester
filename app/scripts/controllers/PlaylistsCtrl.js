'use strict';

/* Controllers */

angular.module('septWebRadioControllers')
  .controller('PlaylistsCtrl',
    ['$scope', '$routeParams', 'playlistServices', 'userServices', 'soundCloudServices',
      function ($scope, $routeParams, playlistServices, userServices, soundCloudServices) {

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
          $scope.selectedPlaylistId = playlistId;
          var trackIds = playlistServices.getTrackIds($scope.playlists, playlistId);
          soundCloudServices.getTracks(trackIds).then(function (items) {
            $scope.playlistItems = items;
          });
        };

        $scope.sortableOptions = {
          // called after a node is dropped
          stop: function(e, ui) {
            var logEntry = {
              ID: 1,
              Text: 'Moved element: ' + ui.item.scope().item.text
            };
            console.log(logEntry);
          }
        };
      }
    ]
  );
