'use strict';

/* Stage Controller */

angular.module('septWebRadioControllers');

angular.module('septWebRadioControllers').controller('StageCtrl', ['$scope', 'soundcloudSearch', 'limitToFilter',
  function ($scope, soundcloudSearch, limitToFilter) {
    $scope.title = 'Stage';

    $scope.isSearching = false;

    $scope.search = undefined;
    $scope.selectedItem = undefined;
    $scope.searchedItems = undefined;

    $scope.searches = function ($search) {
      return soundcloudSearch.autoCompleteSearch($search).then(function (response) {

        $scope.searchedItems = response;

        return limitToFilter(response, 5);
      });
    };

    $scope.onSelectSearch = function ($item) {
      $scope.selectedItem = $item;
    };
  }]
);
