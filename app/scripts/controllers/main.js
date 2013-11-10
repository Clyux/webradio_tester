'use strict';

/* global DZ */

/* Controllers */

angular.module('septWebRadioControllers', ['septWebRadioServices']);

angular.module('septWebRadioControllers').controller('MainCtrl', ['$scope', 'initApplication',
  function ($scope, initApplication) {

    $scope.connexionButtonLabel = 'Log In';

    initApplication.then(function (data) {
      DZ.init({
        appId: data.appId,
        channelUrl: data.url
      });

      // Then see if the user is logged
      DZ.getLoginStatus(function (response) {
        updateUserStatus(response);
        $scope.$apply();
      });
    });

    function updateUserStatus(response) {
      switch (response.status) {
        case 'connected':
          $scope.connexionButtonLabel = 'Log Out';
          if (response.authResponse) {
            $scope.deezerSession = response;
            DZ.api('/user/me', function (response) {
              $scope.deezerUser = response;
              $scope.$apply();
            });
          } else {
            // No auth
            authorizeCurrentUser();
          }
          break;
        case 'not_authorized':
          authorizeCurrentUser();
          break;
        case 'notConnected':
        case 'unknown':
          initSession();
          break;
        default:
          initSession();
          break;
      }
    }

    function authorizeCurrentUser() {
      $scope.connexionButtonLabel = 'Authorize';
      $scope.deezerSession = null;
      $scope.deezerUser = null;
      $scope.$apply();
    }

    function initSession() {
      $scope.connexionButtonLabel = 'Log In';
      $scope.deezerSession = null;
      $scope.deezerUser = null;
      $scope.$apply();
    }

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.logInClick = function () {
      // If the user is connected
      if ($scope.deezerSession) {
        // Log out
        DZ.logout();
        initSession();
      } else {
        // Try to connect the user.
        DZ.login(function (response) {
          updateUserStatus(response);
        }, {perms: 'basic_access,email,manage_library,delete_library'});
      }
    };
  }]);

angular.module('septWebRadioControllers').controller('StageCtrl', ['$scope', function ($scope) {
  $scope.title = 'Stage';
}]
);

angular.module('septWebRadioControllers').controller('ReplayCtrl', ['$scope', function ($scope) {
  $scope.title = 'Replay';
}]
);

angular.module('septWebRadioControllers').controller('TopicalCtrl', ['$scope', function ($scope) {
  $scope.title = 'Topical';
}]
);
angular.module('septWebRadioControllers').controller('DoorCtrl', ['$scope', function ($scope) {
  $scope.title = 'Door';
}]
);

angular.module('septWebRadioControllers').controller('BackstageCtrl', ['$scope', function ($scope) {
  $scope.title = 'Back Stage';
}]
);
