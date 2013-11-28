'use strict';

/* global jQuery */

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .controller('swrDragController', [
    '$rootScope',
    '$scope',
    '$element',
    'swrDragAndDropService',
    function controller($rootScope, $scope, $element, swrDragAndDrop) {
      this.dragInit = function dragInit() {
        if ($element.hasClass('swr-select')) {
          return jQuery('.swr-select');
        } else {
          return undefined;
        }
      };

      this.dragStart = function dragStart() {
        var id = $element.attr('data-item-id');

        swrDragAndDrop.addDraggedItem(id);

        $element.addClass('swr-drag-start');
        $rootScope.$emit('SWR-DRAG-START', $element);
      };

      this.drag = function drag(ev, dd) {
        $element.css({
          top: dd.offsetY,
          left: dd.offsetX
        });
      };

      this.dragEnd = function dragEnd(ev, dd) {
        swrDragAndDrop.removeDraggedItem($element.attr('data-item-id'));

        $rootScope.$emit('SWR-DRAG-END', $element);
        $element.removeClass('swr-drag-start');
        $element.animate({
          top: dd.originalY,
          left: dd.originalX
        }, 500);
      };

      this.cleanDrag = function cleanDrag() {
        $element.unbind('draginit', this.dragInit);
        $element.unbind('dragstart', this.dragStart);
        $element.unbind('drag', this.drag);
        $element.unbind('dragend', this.dragEnd);
      };
    }
  ])
  .directive('swrDraggable', [
    function () {
      return {
        restrict: 'A',
        controller: 'swrDragController',
        link: function link(scope, element, attrs, ctrl) {
          element.drag('init', ctrl.dragInit);

          element.drag('start', ctrl.dragStart);

          element.drag(ctrl.drag, { relative: true });

          element.drag('end', ctrl.dragEnd);

          element.on('$destroy', ctrl.cleanDrag);
        }
      };
    }
  ])
  .controller('swrDropController', [
    '$rootScope',
    '$scope',
    '$element',
    'swrDragAndDropService',
    function controller($rootScope, $scope, $element, swrDragAndDropService) {

      $rootScope.$on('SWR-DRAG-START', function () {
        $element.addClass('swr-drop-target');
      });

      $rootScope.$on('SWR-DRAG-END', function () {
        $element.removeClass('swr-drop-target');
        $element.removeClass('swr-drop-over');
      });

      this.dropStart = function dropStart() {
        $element.addClass('swr-drop-over');
      };

      this.drop = function drop() {
        var draggedItems = swrDragAndDropService.getDraggedItems();
        $scope.onDrop({droppedItems: draggedItems});
        swrDragAndDropService.removeAllDraggedItems();
      };

      this.dropEnd = function dropEnd() {
        $element.removeClass('swr-drop-over');
      };

      this.cleanDrop = function cleanDrop() {
        $element.unbind('dropstart', this.dropStart);
        $element.unbind('drop', this.drop);
        $element.unbind('dropend', this.dropEnd);
        $element.unbind('SWR-DRAG-START');
        $element.unbind('SWR-DRAG-END');
      };
    }
  ])
  .directive('swrDropTarget', [
    function () {
      return {
        restrict: 'A',
        controller: 'swrDropController',
        scope: {
          onDrop: '&'
        },
        link: function link(scope, element, attrs, ctrl) {
          element.drop('start', ctrl.dropStart);

          element.drop(ctrl.drop, { multi: true });

          element.drop('end', ctrl.dropEnd);

          element.on('$destroy', ctrl.cleanDrop);
        }
      };
    }
  ]);