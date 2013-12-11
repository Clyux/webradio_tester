'use strict';

/* global _ */

/* Drag and Drop Service */

angular.module('septWebRadioServices');

angular.module('septWebRadioServices')
  .service('swrDragAndDropService', ['$rootScope',
    function ($rootScope) {

      var self = this;
      this.dragItems = [];

      this.addDraggedItem = function ($item) {
        // If this item is not already here
        if (_.indexOf(self.dragItems, $item) === -1) {
          self.dragItems.push($item);
        }
        $rootScope.$emit('SWR-DRAG-START-NUMBER', _.size(self.dragItems));
      };

      this.removeDraggedItem = function ($item) {
        self.dragItems = _.without(self.dragItems, $item);
        $rootScope.$emit('SWR-DRAG-END-NUMBER');
      };

      this.getDraggedItems = function () {
        return self.dragItems;
      };

      this.removeAllDraggedItems = function () {
        self.dragItems.splice(0, self.dragItems.length);
      };
    }
  ]);
