/**
 * Module dependencies.
 */

var config = require('./config/config.js');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var developmentEnv = 'development' == app.get('env');

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

if (developmentEnv) {
  // development only
  console.log('Development Environment');
  app.configure(function () {
    app.set('views', __dirname + '/app');
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
  });
}
else {
  // production
  console.log('Production Environment');
  app.configure(function () {
    app.set('views', __dirname + '/dist');
    app.use(express.static(path.join(__dirname, 'dist')));
  });
}

app.get('/', routes.index);

module.exports = app;

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

