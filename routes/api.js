'use strict';

/**
 * Created by jimmy on 09/11/13.
 */

var deezerCredentials = require('../config/deezerCredentials');

function getAppConfiguration(req, res) {
  var protocol = req.protocol;
  var host = req.host;
  var port = '';
  var appId = deezerCredentials.appId;

  if (host === 'localhost') {
    port = ':3000';
    appId = deezerCredentials.localhostAppId;
  }

  var url = protocol + '://' + host + port + '/deezer/get_channel';
  res.send({url: url, appId: appId});
}

exports.initApplication = function (req, res) {
  // Init the application session, ...

  return getAppConfiguration(req, res);
};