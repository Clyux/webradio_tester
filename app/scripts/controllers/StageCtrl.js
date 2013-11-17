'use strict';

/* Stage Controller */

angular.module('septWebRadioControllers');

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
