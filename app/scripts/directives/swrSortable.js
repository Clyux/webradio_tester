'use strict';

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .controller('swrSortableCtrl', [
    '$scope',
    '$element',
    function controller($scope, $element) {
      var bricks = {};
      var destroyed = false;
      var self = this;

      this.appendBrick = function appendBrick(element, id) {
        if (destroyed) {
          return;
        }
        $element.gridly('layout');
      };

      this.removeBrick = function removeBrick(id, element) {
        if (destroyed) {
          return;
        }
        delete bricks[id];
        //$element.gridly('layout');
      };

      this.destroy = function destroy() {
        destroyed = true;
        // $element.gridly('layout');
        bricks = [];
      };

      this.layout = function reload() {
        $element.gridly();
      };
    }
  ])
  .directive('swrSortable', [
    function () {
      return {
        restrict: 'A',
        controller: 'swrSortableCtrl',
        link: function link(scope, element) {
          console.log(element);
          element.gridly({});
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
            var id = scope.$id, index;
            ctrl.appendBrick(element, id);

            element.on('$destroy', function () {
              ctrl.removeBrick(id, element);
            });

            scope.$watch('$index', function () {
              if (index !== undefined && index !== scope.$index) {
                ctrl.layout();
              }
              index = scope.$index;
            });
          }
        }
      };
    }
  ]);