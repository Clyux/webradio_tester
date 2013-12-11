'use strict';

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .directive('swrSelect', [
    function () {
      return {
        restrict: 'A',
        scope: {
          swrSelectCallback: '&'
        },
        link: function (scope, element, attrs) {
          var swrSelectClass = attrs.swrSelectClass !== undefined ? attrs.swrSelectClass : 'swr-select';

          element.bind('click', function () {
              var elementId = element.attr('data-item-id');
              if (element.attr('selected')) {
                element.removeClass(swrSelectClass);
                element.removeAttr('selected');
                scope.swrSelectCallback({toggleItem: elementId});
              } else {
                element.addClass(swrSelectClass);
                element.attr('selected', true);
                scope.swrSelectCallback({toggleItem: elementId});
              }
            }
          );
        }
      };
    }
  ]);