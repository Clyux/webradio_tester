'use strict';

/* global jQuery */

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .controller('swrDragAndDropController', [
    '$rootScope',
    '$scope',
    '$element',
    function controller($rootScope, $scope, $element) {

      this.dragInit = function dragInit() {
        if ($element.hasClass('swr-select')) {
          return jQuery('.swr-select');
        } else {
          return undefined;
        }
      };

      this.dragStart = function dragStart() {
        $element.addClass('swr-start');
        $rootScope.$emit('SWR-DRAG-START', $element);
      };

      this.drag = function drag(ev, dd) {
        $element.css({
          top: dd.offsetY,
          left: dd.offsetX
        });
      };

      this.dragEnd = function dragEnd(ev, dd) {
        $rootScope.$emit('SWR-DRAG-END', $element);
        $element.removeClass('swr-start');
        $element.animate({
          top: dd.originalY,
          left: dd.originalX
        }, 500);
      };

      this.dropStart = function dropStart() {
        $element.addClass('swr-over');
      };

      this.drop = function drop(ev, dd) {
        var event = ev;
        var object = dd;
        if (event === object) {
          return false;
        } else {
          return true;
        }
      };

      this.dropEnd = function dropEnd() {
        $element.removeClass('swr-over');
      };
    }
  ])
  .directive('swrDraggable', [
    function () {
      return {
        restrict: 'A',
        controller: 'swrDragAndDropController',
        link: function (scope, element, attrs, ctrl) {

          element.drag('init', ctrl.dragInit);

          element.drag('start', ctrl.dragStart);

          element.drag(ctrl.drag, { relative: true });

          element.drag('end', ctrl.dragEnd);
        }
      };
    }
  ])
  .directive('swrDropTarget', ['$rootScope',
    function ($rootScope) {
      return {
        restrict: 'A',
        controller: 'swrDragAndDropController',
        scope: {
          onDrop: '&'
        },
        link: function (scope, element, attrs, ctrl) {

          element.drop('start', ctrl.dropStart);

          element.drop(ctrl.drop, { multi: true });

          element.drop('end', ctrl.dropEnd);

          $rootScope.$on('SWR-DRAG-START', function () {
            element.addClass('swr-target');
          });

          $rootScope.$on('SWR-DRAG-END', function () {
            element.removeClass('swr-target');
            element.removeClass('swr-over');
          });
        }
      };
    }
  ]);