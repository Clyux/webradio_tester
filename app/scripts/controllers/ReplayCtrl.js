'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('ReplayCtrl', ['$scope',
  function ($scope) {
    $scope.init = function () {
      $scope.initPageTitle('Replay');
    };
  }]
);