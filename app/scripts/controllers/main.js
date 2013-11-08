'use strict';

/* Controllers */

angular.module('septWebRadioControllers', []);

angular.module('septWebRadioControllers').controller('MainCtrl', ['$scope', function ($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
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
