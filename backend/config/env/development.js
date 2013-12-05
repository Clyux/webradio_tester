'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');
var appPath = path.join(rootPath, 'app');

module.exports = {
  db: 'mongodb://localhost/sept',
  appPath: appPath,
  soundCloud: {
    clientID: '169198e13943cce802e8a7cae7a6e89a',
    clientSecret: '053aed10d56a4f556cfc57edf13dc6fd',
    callbackURL: 'http://localhost:3000/soundcloud/auth/callback'
  }
};