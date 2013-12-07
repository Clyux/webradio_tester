'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Auth callback
 */
exports.authCallback = function (req, res) {
  res.redirect('/');
};

/**
 * Show login form
 */
exports.login = function (req, res) {
  res.render('index.html');
  res.location('/login');
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
  res.render('index.html', {
    user: new User()
  });
  res.location('/signup');
};

/**
 * Logout
 */
exports.signout = function (req, res) {
  req.logout();
};

/**
 * Session
 */
exports.session = function (req, res) {
  console.log('session ok');
  console.log(req.user);
  return res.send({
    error: undefined,
    user: req.user
  });
};

/**
 * Create user
 */
exports.create = function (req, res, next) {

  var user = new User(req.body);
  user.provider = 'local';

  // Save the user inside MongoDB
  user.save(function (err) {
    if (err) {
      return res.send({
        error: {
          error: err.err,
          code: err.code,
        }
      });
    }

    // Log the user for passport.
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send({
        error: undefined,
        user: user
      });
    });
  });
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('Failed to load User ' + id));
      }
      req.profile = user;
      next();
    });
};