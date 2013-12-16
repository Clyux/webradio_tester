'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('TopicalCtrl', ['$scope',
  function ($scope) {
    $scope.init = function () {
      $scope.initPageTitle('Topical');
    };
  }]
);