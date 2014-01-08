'use strict';

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .controller('swrSortableCtrl', [
    '$scope',
    '$element',
    function controller($scope, $element) {
      this.positionFrom = -1;
      var self = this;

      this.init = function () {
        $element.sortable({
          opacity: 0.9,
          containment: 'parent',
          cursor: 'move',
          forceHelperSize: true,
          forcePlaceholderSize: true,
          revert: true,
          tolerance: 'pointer',
          start: function (e, ui) {
            self.startMoving(ui.item);
          },
          stop: function (e, ui) {
            self.stopMoving(ui.item);
          }
        });
        $element.disableSelection();
      };

      this.appendBrick = function () {
        $element.sortable('refreshPositions');
      };

      this.startMoving = function (element) {
        if (element === undefined) {
          self.positionFrom = -1;
        } else {
          self.positionFrom = element.index();
        }
      };

      this.stopMoving = function (element) {
        if (element !== undefined) {
          var positionTo = element.index();
          if (positionTo !== self.positionFrom) {
            $scope.swrSortableMoveItem({positionFrom: self.positionFrom, positionTo: positionTo});
          }
        }
        self.positionFrom = -1;
      };
    }
  ])
  .directive('swrSortable', [
    function () {
      return {
        restrict: 'A',
        controller: 'swrSortableCtrl',
        scope: {
          swrSortableMoveItem: '&'
        },
        link: function link(scope, element, attrs, ctrl) {
          ctrl.init();
        }
      };
    }
  ])
  .directive('swrSortableBrick', [
    function () {
      return {
        restrict: 'A',
        require: '^swrSortable',
        scope: true,
        link: {
          pre: function (scope, element, attrs, ctrl) {
            ctrl.appendBrick(element);
          }
        }
      };
    }
  ]);