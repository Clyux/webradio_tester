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

      $scope.dropped = function (dragEl) { // function referenced by the drop target
        //this is application logic, for the demo we just want to color the grid squares
        //the directive provides a native dom object, wrap with jqlite
        var drag = angular.element(dragEl);

        var id = '' + drag.attr('data-item-id');

        var item = _.find($scope.searchedItems, function (listItem) {
          return id === listItem.id;
        });
        $scope.open(item);
      };

      $scope.open = function (item) {
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          resolve: {
            item: function () {
              return item;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      var ModalInstanceCtrl = function ($scope, $modalInstance, item) {
        $scope.item = item;
        $scope.ok = function () {
          $modalInstance.close($scope.item);
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };
    }]
  );