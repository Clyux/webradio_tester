'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.send(401, 'User is not authorized for this user!');
    }
    next();
  }
};

/**
 * Article authorizations routing middleware
 */
exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      return res.send(401, 'User is not authorized for this article!');
    }
    next();
  }
};

/**
 * Playlist authorizations routing middleware
 */
exports.playlist = {
  hasAuthorization: function (req, res, next) {
    if (req.playlist.user.id != req.user.id) {
      return res.send(401, 'User is not authorized for this playlist!');
    }
    next();
  }
};