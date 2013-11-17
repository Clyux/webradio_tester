'use strict';

/* Main Controller  */

angular.module('septWebRadioControllers');

angular.module('septWebRadioControllers').controller('MainCtrl', ['$scope', 'applicationServices',
  function ($scope, applicationServices) {

    $scope.connexionButtonLabel = undefined;
    $scope.user = undefined;

    applicationServices.getInitApplication().then(function (data) {
      $scope.user = data;

      // Check if the user is connected
      if (data) {
        // The user is connected
      }
      $scope.connexionButtonLabel = applicationServices.getConnexionLabel();
    });

    $scope.logInLogOutClick = function () {
      applicationServices.logInLogOut().then(function (label) {
        $scope.connexionButtonLabel = label;
      });
    };
  }]
);