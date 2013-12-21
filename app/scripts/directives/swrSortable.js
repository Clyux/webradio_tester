'use strict';

/* global Draggabilly */

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .controller('swrSortableCtrl', [
    '$scope',
    '$element',
    function controller($scope, $element) {
      var bricks = {};
      var destroyed = false;

      this.appendBrick = function appendBrick() {
        if (destroyed) {
          return;
        }

        //$element.shapeshift();
        /*$element.append(element)
          .packery('appended', element);*/

        // make item elements draggable
        //self.makeEachDraggable(0, element);

        //$element.packery('appended', element, true);
      };

      this.removeBrick = function removeBrick(id) {
        if (destroyed) {
          return;
        }
        delete bricks[id];
      };

      this.destroy = function destroy() {
        destroyed = true;
        // $element.gridly('layout');
        bricks = [];
      };

      this.layout = function reload() {
      };

      this.makeEachDraggable = function (i, itemElem) {
        // make element draggable with Draggabilly
        var draggie = new Draggabilly(itemElem);
        // bind Draggabilly events to Packery
        $element.packery('bindDraggabillyEvents', draggie);
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

          // element.shapeshift({colWidth: 200});
          /*element.packery({
            columnWidth: 80,
            rowHeight: 80
          });*/
          element.sortable();
          element.disableSelection();
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