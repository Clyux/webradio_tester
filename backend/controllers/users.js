'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');

function logInUser(req, res, next, user) {
  req.logIn(user, function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }

    return res.send({
      user: user
    });
  });
}

module.exports = function (passport) {
  return {
    authCallback: function (req, res) {
      res.redirect('/');
    },

    /**
     * Show login form
     */
    login: function (req, res) {
      console.log('login');
      res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
      });
    },

    /**
     * Show sign up form
     */
    signup: function (req, res) {
      res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
      });
    },

    /**
     * Logout
     */
    signout: function (req, res) {
      req.logout();
      return res.send({
        message: 'Success'
      });
    },

    /**
     * Session
     */
    session: function (req, res, next) {
      passport.authenticate('local',
        function (err, user, info) {
          if (err) {
            console.log(err);
            return next(err);
          }
          if (!user) {
            return res.send({
              error: info
            });
          }

          // Log the user in session
          return logInUser(req, res, next, user);
        })(req, res, next);
    },

    /**
     * Create user
     */
    create: function (req, res, next) {
      var user = new User(req.body);
      user.provider = 'local';

      // Save the user inside MongoDB
      user.save(function (err) {

        if (err) {
          console.log(err);
          return res.send({
            error: {
              error: err.err,
              errorCode: err.code
            }
          });
        }

        // Log the user in session
        return logInUser(req, res, next, user);
      });
    },

    /**
     * Send User
     */
    me: function (req, res) {
      res.jsonp(req.user || null);
    },

    /**
     * Find user by id
     */
    user: function (req, res, next, id) {
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
    }
  }
};
