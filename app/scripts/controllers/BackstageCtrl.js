'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('BackstageCtrl', ['$scope',
  function ($scope) {
    $scope.init = function () {
      $scope.initPageTitle('Back Stage');
    };
  }]
);
