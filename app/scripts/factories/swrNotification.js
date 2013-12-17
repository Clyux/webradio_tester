'use strict';

/* global alertify */

/* Notification */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('swrNotification', ['swrGmailNotify',
    function (swrGmailNotify) {
      var swrNotification = {};

      swrNotification.success =
        function (message) {
          if (message && message.length > 0) {
            alertify.success(message);
          }
        };

      swrNotification.info =
        function (message) {
          if (message && message.length > 0) {
            alertify.log(message);
          }
        };

      swrNotification.error =
        function (message) {
          if (message && message.length > 0) {
            alertify.error(message);
          }
        };

      swrNotification.message =
        function (message) {
          if (message && message.length > 0) {
            swrGmailNotify.message(message);
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