'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
//var soundCloud = require('./routes/soundCloud.js');
//var api = require('./routes/api.js');
var http = require('http');
//var path = require('path');
//var MongoStore = require('connect-mongo')(express);
var fs = require('fs');
var passport = require('passport');
var logger = require('mean-logger');

// Load configurations
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./backend/config/config');
var auth = require('./backend/config/middlewares/authorization');
var mongoose = require('mongoose');


// Bootstrap db connection
mongoose.connect(config.db);

var dbConnexion = mongoose.connection;
dbConnexion.on('error', function error(er) {
  console.log('Error MongoDB: ' + er);
});

dbConnexion.once('open', function callback() {
  console.log('MongoDB successfully connected.');
});

// Bootstrap models
var modelsPath = __dirname + '/backend/models';
var walk = function (path) {
  fs.readdirSync(path).forEach(function (file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(modelsPath);


// Bootstrap passport config
require('./backend/config/passport')(passport);

// Create express
var app = express();

// Express settings
require('./backend/config/express')(app, env, passport, dbConnexion);

// Bootstrap routes
require('./backend/config/routes')(app, passport, auth);

// Start the app by listening on the port
var port = config.port;
http.createServer(app).listen(port, function () {
  console.log('Express server listening on port ' + port);
});


//Initializing logger
logger.init(app, passport, mongoose);

// Expose app
module.exports = app;