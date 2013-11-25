'use strict';

/* Stage Controller */

angular.module('septWebRadioControllers')
  .controller('StageCtrl', ['$scope', 'soundcloudSearch', 'utilities', '$modal', '$log',
    function ($scope, soundcloudSearch, utilities, $modal, $log) {
      $scope.title = 'Stage';

      $scope.isSearching = false;
      $scope.searchedTerm = undefined;
      $scope.searchedItems = [];
      $scope.list1 = [];

      $scope.search = function () {
        // If there is a term to search
        if ($scope.searchedTerm && $scope.searchedTerm !== '' && $scope.searchedTerm.length >= 2) {
          $scope.isSearching = true;

          // Search the terms
          soundcloudSearch.autoCompleteSearch($scope.searchedTerm)
            .then(function (response) {
              $scope.searchedItems = utilities.unionWithId($scope.searchedItems, response);
              $scope.isSearching = false;
            });
        } else {
          // There is nothing to search
          $scope.isSearching = false;
          $scope.searchedItems.splice(0, $scope.searchedItems.length);
        }
      };

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function () {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0]
        };

        $scope.ok = function () {
          $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };

    }]
  );