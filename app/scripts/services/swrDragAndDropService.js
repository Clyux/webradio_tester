'use strict';

/* global _ */

/* Drag and Drop Service */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('swrDragAndDropService', [
    function () {

      var self = this;
      this.dragItems = [];

      this.addDraggedItem = function ($item) {
        // If this item is not already here
        if (_.indexOf(self.dragItems, $item) === -1) {
          self.dragItems.push($item);
        }
      };

      this.removeDraggedItem = function ($item) {
        self.dragItems = _.without(self.dragItems, $item);
      };

      this.getDraggedItems = function () {
        return self.dragItems;
      };

      this.removeAllDraggedItems = function () {
        self.dragItems.splice(0, self.dragItems.length);
      };
    }
  ]);
