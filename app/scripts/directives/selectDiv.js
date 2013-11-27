'use strict';

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .directive('swrSelectDiv', [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element) {
          element.bind('click', function () {
              if (element.attr('selected')) {
                element.removeClass('swr-select');
                element.removeClass('ui-selected');
                element.removeAttr('selected');
              } else {
                element.addClass('swr-select');
                element.addClass('ui-selected');
                element.attr('selected', true);
              }
            }
          )
          ;
        }
      };
    }
  ]);