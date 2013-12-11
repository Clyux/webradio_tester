'use strict';

/* Input Directives */

angular.module('septWebRadioDirectives')
  .directive('swrDelayedInput', ['$timeout',
    function ($timeout) {
      return {
        restrict: 'A',
        scope: {
          ngModel: '=',
          swrDelayedInputDelayedTime: '=',
          swrDelayedInputCallback: '&'
        },
        link: function (scope) {

          var timer = false;
          var delayedTime = typeof scope.swrDelayedInputDelayedTime !== 'undefined' ? scope.swrDelayedInputDelayedTime : 500;

          if (typeof scope.swrDelayedInputCallback === 'function') {
            scope.$watch('ngModel', function (newVal, oldVal) {
              if (newVal === oldVal) {
                return;
              }
              if (newVal) {
                if (timer) {
                  $timeout.cancel(timer);
                }
                timer = $timeout(function () {
                  scope.swrDelayedInputCallback();
                }, delayedTime);
              }
            });
          }
        }
      };
    }]
  )
  .directive('autoFillableField', [
    function () {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
          setInterval(function () {
            var previousValue = '';
            if (!angular.isUndefined(attrs.xAutoFillPrevVal)) {
              previousValue = attrs.xAutoFillPrevVal;
            }
            if (element.val() !== previousValue) {
              if (!angular.isUndefined(ngModel)) {
                if (!(element.val() === '' && ngModel.$pristine)) {
                  attrs.xAutoFillPrevVal = element.val();
                  scope.$apply(function () {
                    ngModel.$setViewValue(element.val());
                  });
                }
              }
              else {
                element.trigger('input');
                element.trigger('change');
                element.trigger('keyup');
                attrs.xAutoFillPrevVal = element.val();
              }
            }
          }, 300);
        }
      };
    }
  ]
  );