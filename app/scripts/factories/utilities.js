'use strict';

/* global _ */

/* All utilities */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('utilities', [
    function () {
      var utilitiesService = {};

      utilitiesService.removeItemById =
        function (list, idToRemove) {
          return utilitiesService.removeItemByAttribute(list, idToRemove, 'id');
        };

      utilitiesService.removeItemByAttribute =
        function (list, itemToRemove, attributeName) {
          var listSize = _.size(list);
          var elementLoop;
          for (var index = 0; index < listSize; index++) {
            elementLoop = list[index];
            if (elementLoop[attributeName] === itemToRemove) {
              list.splice(index, 1);
              break;
            }
          }
          return list;
        };

      utilitiesService.listContainsId = function (list, idToRemove) {
        return utilitiesService.listContainsAttribute(list, idToRemove, 'id');
      };

      utilitiesService.listContainsAttribute = function (list, attributeToTest, attributeName) {
        return _.find(list, function (newItem) {
          return attributeToTest === newItem[attributeName];
        });
      };

      utilitiesService.unionWithAttribute =
        function (listTo, listFrom, attributeToTest) {
          var removed = 0;
          var oldListSize = _.size(listTo);
          var element, even;
          for (var index = 0; index < oldListSize; index++) {
            element = listTo[index - removed];

            even = utilitiesService.listContainsAttribute(listFrom, element[attributeToTest], attributeToTest);

            if (even === undefined) {
              // This element is not presents on the new list
              // So just remove it from the list.
              listTo.splice(index - removed, 1);
              removed++;
            } else {
              // If the element is presents inside the new list, just remove it from the second list
              listFrom = utilitiesService.removeItemByAttribute(listFrom, element[attributeToTest], attributeToTest);
            }
          }
          return listTo.concat(listFrom);
        };

      utilitiesService.unionWithId =
        function (listTo, listFrom) {
          return utilitiesService.unionWithAttribute(listTo, listFrom, 'id');
        };

      return utilitiesService;
    }
  ]
  );
