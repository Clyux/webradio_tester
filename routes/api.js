'use strict';

/**
 * Created by jimmy on 09/11/13.
 */

var soundCloudCredentials = require('../config/soundCloudCredentials');

function getAppConfiguration(req, res) {
  var protocol = req.protocol;
  var host = req.host;
  var port = '';
  var clientId = soundCloudCredentials.clientId;

  if (host === 'localhost') {
    port = ':3000';
    clientId = soundCloudCredentials.localhostClientIdId;
  }
  var url = protocol + '://' + host + port + '/soundcloud/auth/callback';
  res.send({url: url, clientId: clientId});
}

exports.initApplication = function (req, res) {
  // Init the application session, ...

  return getAppConfiguration(req, res);
};