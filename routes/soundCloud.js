'use strict';

/**
 * Created by jimmy on 09/11/13.
 */

exports.getCallback = function (req, res) {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('title', 'Connect with SoundCloud');

  res.send('<body onload="window.opener.setTimeout(window.opener.SC.connectCallback, 1)">' +
    '<b style="width: 100%; text-align: center;">This popup should automatically close in a few seconds</b>' +
    '</body>');
  res.end();
};
