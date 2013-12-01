'use strict';

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .directive('swrSelect', [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var swrSelectClass = attrs.swrSelectClass !== undefined ? attrs.swrSelectClass : 'swr-select';

          element.bind('click', function () {
              if (element.attr('selected')) {
                element.removeClass(swrSelectClass);
                element.removeAttr('selected');
              } else {
                element.addClass(swrSelectClass);
                element.attr('selected', true);
              }
            }
          );
        }
      };
    }
  ]);