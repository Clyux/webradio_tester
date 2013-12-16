'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('SignCtrl',
  ['$scope', '$location', 'userServices',
    function ($scope, $location, userServices) {

      $scope.user = {};
      $scope.logInUser = {};
      $scope.$location = $location;

      $scope.init = function () {
        if ($scope.$location.$$url === '/signup') {
          $scope.initPageTitle('Sign Up');
        } else if ($scope.$location.$$url === '/login') {
          $scope.initPageTitle('Log In');
        } else {
          $scope.initPageTitle();
        }
      };

      $scope.createUser = function (userForm) {
        if (!userForm) {
          return;
        }
        if (userForm.$valid) {
          userServices.signUp($scope.user);
        }
      };

      $scope.logInUserAction = function (logInForm) {
        if (!logInForm) {
          return;
        }
        if (logInForm.$valid) {
          userServices.logIn($scope.logInUser);
        }
      };
    }]
);