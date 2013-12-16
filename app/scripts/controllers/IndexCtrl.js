'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('IndexCtrl', ['$scope',
  function ($scope) {
    $scope.init = function () {
      $scope.initPageTitle();
    };
  }]
);
