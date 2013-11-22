'use strict';

/* Stage Controller */

angular.module('septWebRadioControllers')
  .controller('StageCtrl', ['$scope', 'soundcloudSearch', 'limitToFilter',
    function ($scope, soundcloudSearch, limitToFilter) {
      $scope.title = 'Stage';

      $scope.isSearching = false;
      $scope.searchedTerm = undefined;
      $scope.searchedItems = [];

      $scope.search = function () {
        // If there is a term to search
        if ($scope.searchedTerm && $scope.searchedTerm !== '' && $scope.searchedTerm.length >= 2) {
          $scope.isSearching = true;

          // Remove all the items for the list.
          $scope.searchedItems.splice(0, $scope.searchedItems.length);

          // Search the terms
          soundcloudSearch.autoCompleteSearch($scope.searchedTerm)
            .then(function (response) {
              $scope.searchedItems = limitToFilter(response, 20);
              $scope.isSearching = false;
            });
        } else {
          // There is nothing to search
          $scope.isSearching = false;
          $scope.searchedItems = [];
        }
      };
    }]
  );