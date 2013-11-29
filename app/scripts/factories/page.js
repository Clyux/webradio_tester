'use strict';

/* Page Factory */

angular.module('septWebRadioFactories');

angular.module('septWebRadioFactories')
  .factory('Page', function () {
    var defaultTitle = 'Sept Web Radio';
    var title = '';
    return {
      title: function () {
        return title;
      },
      setTitle: function (newTitle) {
        if (newTitle === undefined || newTitle === '') {
          title = defaultTitle;
        } else {
          title = defaultTitle + ' - ' + newTitle;
        }
      }
    };
  });