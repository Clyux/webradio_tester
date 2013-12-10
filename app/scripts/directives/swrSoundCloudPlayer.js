'use strict';

/* global SC */

/* Sound Cloud Player Directives */

angular.module('septWebRadioDirectives')
  .directive('swrSoundcloudPlayer', [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          /*
           var trackUrl = 'http://api.soundcloud.com/playlists/1595551';
           SC.oEmbed(trackUrl, { auto_play: true, show_comments: false },
           function (oEmbed) {
           var player = $compile(oEmbed.html)(scope);
           element.append(player);
           });
           https://w.soundcloud.com/player/api_playground.html
           */

          var config = '&amp;auto_play=true&amp;download=true&amp;show_comments=false';
          var widgetUrl = ' https://soundcloud.com/lapause/sets/la-pause-playlist-21' + config;
          var sourceUrl = location.protocol + '//w.soundcloud.com/player/?url=' + widgetUrl;

          element.attr('src', sourceUrl);
          /*var widget = */
          SC.Widget(attrs.id);
        }
      };
    }
  ]
  );