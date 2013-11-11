'use strict';

/* global DZ */

/* Controllers */

angular.module('septWebRadioControllers', ['septWebRadioServices']);

angular.module('septWebRadioControllers').controller('MainCtrl', ['$scope', 'initApplication',
  function ($scope, initApplication) {

    $scope.connexionButtonLabel = 'Log In';
    $scope.appId = '';
    $scope.channelUrl = '';

    initApplication.getInitApplication().then(function (data) {
      $scope.appId = data.appId;
      $scope.channelUrl = data.url;
      DZ.init({
        appId: $scope.appId,
        channelUrl: $scope.channelUrl
      });

      // Then see if the user is logged
      DZ.getLoginStatus(function (response) {
        console.log(response);
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
      $scope.deezerSession = undefined;
      $scope.deezerUser = undefined;
      $scope.$apply();
    }

    function initSession() {
      $scope.connexionButtonLabel = 'Log In';
      $scope.deezerSession = undefined;
      $scope.deezerUser = undefined;
      $scope.$apply();
    }

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

angular.module('septWebRadioControllers').controller('StageCtrl', ['$scope', '$http', 'deezerSearch',
  function ($scope, $http, deezerSearch) {
    $scope.title = 'Stage';

    $scope.isSearching = false;

    $scope.search = undefined;
    $scope.selectedItem = undefined;

    $scope.searches = function ($search) {
      return deezerSearch.autoCompleteSearch($search).then(function (response) {
        return response;
      });
    };

    $scope.onSelectSearch = function ($item) {
      $scope.selectedItem = $item;
    };
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
