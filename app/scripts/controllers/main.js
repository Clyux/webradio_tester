'use strict';

/* Controllers */

angular.module('septWebRadioControllers', ['septWebRadioServices']);

angular.module('septWebRadioControllers').controller('MainCtrl', ['$scope', 'applicationServices', 'soundCloudServices',
  function ($scope, applicationServices, soundCloudServices) {

    $scope.connexionButtonLabel = undefined;

    applicationServices.getInitApplication().then(function (data) {
      // Check if the user is connected
      if (data) {
        // The user is connected
      }
      $scope.connexionButtonLabel = soundCloudServices.getConnexionLabel();
    });

    $scope.logInLogOutClick = function () {
      soundCloudServices.logInLogOut().then(function () {
        $scope.connexionButtonLabel = soundCloudServices.getConnexionLabel();
      });
    };
  }]);

angular.module('septWebRadioControllers').controller('StageCtrl', ['$scope', '$http', 'soundcloudSearch',
  function ($scope, $http, soundcloudSearch) {
    $scope.title = 'Stage';

    $scope.isSearching = false;

    $scope.search = undefined;
    $scope.selectedItem = undefined;

    $scope.searches = function ($search) {
      return soundcloudSearch.autoCompleteSearch($search).then(function (response) {
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
