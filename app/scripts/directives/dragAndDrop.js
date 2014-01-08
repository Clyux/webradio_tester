'use strict';

/* global jQuery, _ */

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .controller('swrDragController', [
    '$rootScope',
    '$scope',
    '$element',
    'swrDragAndDropService',
    '$animate',
    function controller($rootScope, $scope, $element, swrDragAndDrop, $animate) {

      var self = this;

      this.init = function () {
        $element.drag('init', self.dragInit);
        $element.drag('start', self.dragStart);
        $element.drag(self.drag, { relative: false });
        $element.drag('end', self.dragEnd);
        $element.on('$destroy', self.cleanDrag);
      };

      this.dragInit = function () {
        if ($element.hasClass('swr-select')) {
          return jQuery('.swr-select');
        } else {
          return undefined;
        }
      };

      this.dragStart = function () {
        swrDragAndDrop.addDraggedItem($element.attr('data-item-id'));
        $element.addClass('swr-drag-start');
        $rootScope.$emit('SWR-DRAG-START', $element);
      };

      this.drag = function drag(ev, dd) {
        $element.css({
          top: dd.deltaY,
          left: dd.deltaX
        });
      };

      this.dragEnd = function () {
        swrDragAndDrop.removeDraggedItem($element.attr('data-item-id'));

        $rootScope.$emit('SWR-DRAG-END', $element);
        $animate.removeClass($element, 'swr-drag-start');
        $element.animate({
          top: 0,
          left: 0
        }, 600);
      };

      this.cleanDrag = function () {
        $element.unbind('draginit', this.dragInit);
        $element.unbind('dragstart', this.dragStart);
        $element.unbind('drag', this.drag);
        $element.unbind('dragend', this.dragEnd);
        $element.unbind('$destroy', this.cleanDrag);
      };
    }
  ])
  .directive('swrDraggable', [
    function () {
      return {
        restrict: 'A',
        controller: 'swrDragController',
        link: function link(scope, element, attrs, ctrl) {
          ctrl.init();
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

      var self = this;

      this.init = function () {
        $element.drop('start', self.dropStart);
        $element.drop(self.drop);
        $element.drop('end', self.dropEnd);
        $element.on('$destroy', self.cleanDrop);
        $rootScope.$on('SWR-DRAG-START', self.onSwrDragStart);
        $rootScope.$on('SWR-DRAG-END', self.onSwrDragEnd);
      };

      this.onSwrDragStart = function () {
        $element.addClass('swr-drop-target');
      };

      this.onSwrDragEnd = function () {
        $element.removeClass('swr-drop-target');
        $element.removeClass('swr-drop-over');
      };

      this.dropStart = function () {
        $element.addClass('swr-drop-over');
      };

      this.drop = function () {
        var draggedItems = swrDragAndDropService.getDraggedItems();
        if (_.size(draggedItems) <= 0) {
          return;
        }
        $scope.swrDropTargetOnDrop({droppedItems: draggedItems});
        swrDragAndDropService.removeAllDraggedItems();
      };

      this.dropEnd = function () {
        $element.removeClass('swr-drop-over');
      };

      this.cleanDrop = function () {
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
          swrDropTargetOnDrop: '&'
        },
        link: function link(scope, element, attrs, ctrl) {
          ctrl.init();
        }
      };
    }
  ]);