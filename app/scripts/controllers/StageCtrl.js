'use strict';

/* global _ */

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

      $scope.dropped = function (droppedItems) {
        var scopeItems = [];

        angular.forEach(droppedItems, function (valueId) {
          valueId = parseInt(valueId);
          var item = _.find($scope.searchedItems, function (listItem) {
            return valueId === parseInt(listItem.id);
          });

          this.push(item);
        }, scopeItems);

        $scope.open(scopeItems);
      };

      $scope.open = function (items) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          resolve: {
            items: function () {
              return items;
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
        $scope.ok = function () {
          $modalInstance.close($scope.items);
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };
    }]
  );