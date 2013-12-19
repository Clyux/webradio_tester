'use strict';

/* Controllers */

angular.module('septWebRadioControllers')
  .controller('PlaylistsCtrl',
    ['$scope', '$routeParams', 'playlistServices',
      function ($scope, $routeParams, playlistServices) {

        $scope.playlistServices = playlistServices;

        $scope.init = function () {
          $scope.initPageTitle('Playlists');
          if ($scope.userServices.isConnected()) {
            $scope.playlistServices.initPlaylists();
          }
        };
      }
    ]
  );
