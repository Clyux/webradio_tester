'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('DoorCtrl', ['$scope',
  function ($scope) {
    $scope.init = function () {
      $scope.initPageTitle('Door');
    };
  }]
);