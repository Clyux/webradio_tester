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
                element.removeAttr('selected');
              } else {
                element.addClass('swr-select');
                element.attr('selected', true);
              }
            }
          )
          ;
        }
      };
    }
  ]);