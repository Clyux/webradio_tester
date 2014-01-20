'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('IndexCtrl', ['$scope', 'playlistServices',
  function ($scope, playlistServices) {

    $scope.featuredPlaylists = [];

    $scope.init = function () {
      $scope.initPageTitle();

      // Get the featured playlists
      $scope.featuredPlaylists = playlistServices.getFeaturedPlaylists();
    };
  }]
);
