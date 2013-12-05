'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var mongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var config = require('./config');
var path = require('path');

module.exports = function (app, env, passport, dbConnexion) {
  app.set('showStackError', true);

  //Prettify HTML
  app.locals.pretty = true;

  //Should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  //Setting the fav icon and static folder
  app.use(express.favicon());

  app.set('port', config.port);

  if (env === 'development') {
    // Development only
    console.log('Development Environment');
    app.set('views', config.root + '/app');
    app.use(express.static(path.join(config.root, 'app')));
    app.use(express.errorHandler());
  }
  else {
    // Production
    console.log('Production Environment');
    app.set('views', config.root + '/dist');
    app.use(express.static(path.join(config.root, 'dist')));
  }

  // Don't use logger for test env
  if (env !== 'test') {
    app.use(express.logger('dev'));
  }

  // Enable jsonp
  app.enable('jsonp callback');

  app.configure(function () {
    // CookieParser should be above session
    app.use(express.cookieParser());

    // For the view engine
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    // request body parsing middleware should be above methodOverride
    app.use(express.urlencoded());
    app.use(express.json());

    //express/mongo session storage
    app.use(express.session({
      secret: 'My_Real_Secret_Here',
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
      clear_interval: 3600,
      store: new mongoStore({
        db: dbConnexion.db,
        collection: 'sessions'
      })
    }));

    // Connect flash for flash messages
    app.use(flash());

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //routes should be at the last
    app.use(app.router);

    //Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
      //Treat as 404
      if (err.message.indexOf('not found')) {
        console.log('not found');
        return next();
      }

      //Log it
      console.error('Internal Error: ' + err.stack);

      //Error page
      res.status(500).render('500', {
        error: err.stack
      });
    });

    //Assume 404 since no middleware responded
    app.use(function (req, res) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });
  });
};
