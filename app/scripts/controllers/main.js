'use strict';

/* global DZ */

/* Controllers */

angular.module('septWebRadioControllers', ['septWebRadioServices']);

angular.module('septWebRadioControllers').controller('MainCtrl', ['$scope', 'initApplication',
  function ($scope, initApplication) {

    initApplication.then(function (data) {
      DZ.init({
        appId: data.appId,
        channelUrl: data.url
      });
    });

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.connexionButtonLabel = 'Connexion';

    $scope.connexion = function () {
      DZ.login(function (response) {
        if (response.authResponse) {
          console.log('Welcome! Fetching your information.... ');
          DZ.api('/user/me', function (response) {
            console.log('Good to see you, ' + response.name + '.');
            $scope.connexionButtonLabel = 'Déconnexion';
            $scope.$apply();
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {perms: 'basic_access,email,manage_library,delete_library'});
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
