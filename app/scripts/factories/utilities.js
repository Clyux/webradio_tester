'use strict';

/* global _ */

/* All utilities */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('utilities', [
    function () {
      var utilitiesService = {};

      utilitiesService.removeItem =
        function (list, itemToRemove) {
          var listSize = _.size(list);
          var elementLoop;
          for (var index = 0; index < listSize; index++) {
            elementLoop = list[index];
            if (elementLoop.id === itemToRemove.id) {
              list.splice(index, 1);
              break;
            }
          }
          return list;
        };

      utilitiesService.listContainsId = function (list, element) {
        return utilitiesService.listContainsAttribute(list, element, 'id');
      };

      utilitiesService.listContainsAttribute = function (list, element, attr) {
        return _.find(list, function (newItem) {
          return element[attr] === newItem[attr];
        });
      };

      utilitiesService.mergeList =
        function (oldList, newList) {
          var removed = 0;
          var oldListSize = _.size(oldList);
          var element, even;
          for (var index = 0; index < oldListSize; index++) {
            element = oldList[index - removed];

            even = utilitiesService.listContainsId(newList, element);

            if (even === undefined) {
              // This element is not presents on the new list
              // So just remove it from the list.
              oldList.splice(index - removed, 1);
              removed++;
            } else {
              // If the element is presents inside the new list, just remove it from the second list
              newList = utilitiesService.removeItem(newList, element);
            }
          }
          return oldList.concat(newList);
        };

      return utilitiesService;
    }
  ]
  );
