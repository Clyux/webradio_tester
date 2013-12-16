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

      this.init = function init() {
        $element.drag('init', self.dragInit);
        $element.drag('start', self.dragStart);
        $element.drag(self.drag, { relative: true });
        $element.drag('end', self.dragEnd);
        $element.on('$destroy', self.cleanDrag);
      };

      this.dragInit = function dragInit() {
        if ($element.hasClass('swr-select')) {
          return jQuery('.swr-select');
        } else {
          return undefined;
        }
      };

      this.dragStart = function dragStart() {
        swrDragAndDrop.addDraggedItem($element.attr('data-item-id'));
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
        $animate.removeClass($element, 'swr-drag-start');
        $element.animate({
          top: dd.originalY,
          left: dd.originalX
        }, 600);
      };

      this.cleanDrag = function cleanDrag() {
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

      this.onSwrDragStart = function onSwrDragStart() {
        $element.addClass('swr-drop-target');
      };

      $rootScope.$on('SWR-DRAG-START', self.onSwrDragStart);

      this.onSwrDragEnd = function onSwrDragEnd() {
        $element.removeClass('swr-drop-target');
        $element.removeClass('swr-drop-over');
      };

      $rootScope.$on('SWR-DRAG-END', self.onSwrDragEnd);

      this.dropStart = function dropStart() {
        $element.addClass('swr-drop-over');
      };

      this.drop = function drop() {
        var draggedItems = swrDragAndDropService.getDraggedItems();
        if (_.size(draggedItems) <= 0) {
          return;
        }
        $scope.swrDropTargetOnDrop({droppedItems: draggedItems});
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
          swrDropTargetOnDrop: '&'
        },
        link: function link(scope, element, attrs, ctrl) {

          element.drop('start', ctrl.dropStart);

          element.drop(ctrl.drop);

          element.drop('end', ctrl.dropEnd);

          element.on('$destroy', ctrl.cleanDrop);
        }
      };
    }
  ]);