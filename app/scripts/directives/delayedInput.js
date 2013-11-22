'use strict';

/* Delayed Input Search Directives */

angular.module('septWebRadioDirectives')
  .directive('delayedInput', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        ngModel: '=',
        delayedTime: '=',
        callBack: '&'
      },
      link: function (scope) {

        var timer = false;
        var delayedTime = typeof scope.delayedTime !== 'undefined' ? scope.delayedTime : 500;

        if (typeof scope.callBack === 'function') {
          scope.$watch('ngModel', function (newVal, oldVal) {
            if (newVal === oldVal) {
              return;
            }
            if (newVal) {
              if (timer) {
                $timeout.cancel(timer);
              }
              timer = $timeout(function () {
                scope.callBack();
              }, delayedTime);
            }
          });
        }
      }
    };
  }]
  );