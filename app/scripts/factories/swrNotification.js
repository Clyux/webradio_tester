'use strict';

/* global alertify */

/* Notification */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('swrNotification', ['swrGmailNotify', 'utilities', '$timeout',
    function (swrGmailNotify, utilities, $timeout) {
      var swrNotification = {};

      swrNotification.successMessages = [];
      swrNotification.infoMessages = [];
      swrNotification.errorMessages = [];
      swrNotification.messages = [];

      swrNotification.success =
        function (message) {
          if (message && message.length > 0) {
            swrNotification.pushMessage(alertify.success, swrNotification.successMessages, message);
          }
        };

      swrNotification.info =
        function (message) {
          if (message && message.length > 0) {
            swrNotification.pushMessage(alertify.log, swrNotification.infoMessages, message);
          }
        };

      swrNotification.error =
        function (message) {
          if (message && message.length > 0) {
            swrNotification.pushMessage(alertify.error, swrNotification.errorMessages, message);
          }
        };

      swrNotification.message =
        function (message) {
          if (message && message.length > 0) {
            swrNotification.pushMessage(swrGmailNotify.message, swrNotification.messages, message);
          }
        };

      swrNotification.pushMessage =
        function (func, list, message) {
          if (utilities.isItemNotPresents(list, message)) {
            list.push(message);
            func(message);
            $timeout(function () {
              utilities.removeItem(list, message);
            }, 4000);
          }
        };

      return swrNotification;
    }
  ]);

angular.module('septWebRadioFactories')
  .config([
    function () {
      // Just set the alertify properties
      alertify.set({ delay: 4000 });
    }
  ]);