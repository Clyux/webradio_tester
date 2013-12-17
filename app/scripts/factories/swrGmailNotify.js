'use strict';

/* global $ */

/* notify Factory */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('swrGmailNotify', ['$timeout', '$compile', '$rootScope',
    function ($timeout, $compile, $rootScope) {

      var swrGmailNotify = {};
      swrGmailNotify.startTop = 10;
      swrGmailNotify.verticalSpacing = 30;
      swrGmailNotify.messageElements = [];
      swrGmailNotify.template = '<div class="swr-gmail-notify-message">{{message}}</div>';

      swrGmailNotify.message = function (message) {
        var scope = $rootScope.$new();
        scope.message = message;

        var templateElement = $compile(swrGmailNotify.template)(scope);
        templateElement.on('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd',
          function (e) {
            if (e.originalEvent.propertyName === 'opacity') {
              templateElement.remove();
              templateElement.splice(swrGmailNotify.messageElements.indexOf(templateElement), 1);
            }
          });

        $('body').append(templateElement);
        swrGmailNotify.messageElements.push(templateElement);

        $timeout(function () {
          var j = 0;
          for (var i = swrGmailNotify.messageElements.length - 1; i >= 0; i--) {
            var element = swrGmailNotify.messageElements[i];
            var top = swrGmailNotify.startTop + (j * swrGmailNotify.verticalSpacing);
            element.css('top', top + 'px');
            if (element.css('opacity') === '1') {
              element.css('opacity', 0);
            }
            j++;
          }
        }, 50);

        return templateElement;
      };
      return swrGmailNotify;
    }
  ]);