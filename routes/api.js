'use strict';

/**
 * Created by jimmy on 09/11/13.
 */

var deezerCredentials = require('../config/deezerCredentials');

function getAppConfiguration(req, res) {
  var protocol = req.protocol;
  var host = req.host;
  var port = '';

  if (host === 'localhost') {
    port = ':3000';
  }

  var url = protocol + '://' + host + port + '/deezer/get_channel';
  res.send({url: url, appId: deezerCredentials.appId});
}

exports.initApplication = function (req, res) {
  // Init the application session, ...

  return getAppConfiguration(req, res);
};