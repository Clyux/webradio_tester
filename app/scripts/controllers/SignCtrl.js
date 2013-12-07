'use strict';

/* Controllers */

angular.module('septWebRadioControllers').controller('SignCtrl', ['$scope', 'Page', '$route', '$location', 'userServices',
  function ($scope, Page, $route, $location, userServices) {

    $scope.user = {};
    $scope.logInUser = {};
    $scope.$location = $location;

    if ($scope.$location.$$url === '/signup') {
      Page.setTitle('Sign Up');
    } else if ($scope.$location.$$url === '/login') {
      Page.setTitle('Log In');
    }

    $scope.createUser = function (userForm) {
      if (userForm.$valid) {
        userServices.signUp($scope.user);
      }
    };

    $scope.logInUser = function (logInForm) {
      console.log(logInForm);
      if (logInForm.$valid) {
        userServices.logIn($scope.logInUser);
      }
    };
  }]
);