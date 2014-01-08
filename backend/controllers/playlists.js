'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Playlist = mongoose.model('Playlist');
var _ = require('underscore');

/**
 * Find one playlist by id
 */
exports.playlist = function (req, res, next, id) {
  Playlist.load(id, function (err, playlist) {
    if (err) {
      return next(err);
    }
    if (!playlist) {
      return next(new Error('Failed to load playlist ' + id));
    }
    req.playlist = playlist;
    next();
  });
};

/**
 * Create a playlist
 */
exports.create = function (req, res) {
  var playlist = new Playlist(req.body);
  playlist.user = req.user;

  playlist.save(function (err) {
    if (err) {
      return res.send({
        errors: err.errors,
        playlist: playlist
      });
    } else {
      res.jsonp(playlist);
    }
  });
};

/**
 * Update a playlist
 */
exports.update = function (req, res) {
  var playlist = req.playlist;

  playlist = _.extend(playlist, req.body);

  playlist.save(function (err) {
    if (err) {
      return res.jsonp(err);
    }
    return res.jsonp(playlist);
  });
};

/**
 * Delete a playlist
 */
exports.destroy = function (req, res) {
  var playlist = req.playlist;

  playlist.remove(function (err) {
    if (err) {
      return res.send({
        errors: err.errors,
        playlist: playlist,
        status: 500
      });
    } else {
      res.jsonp(playlist);
    }
  });
};

/**
 * Show an playlist
 */
exports.show = function (req, res) {
  res.jsonp(req.playlist);
};

/**
 * List of playlist
 */
exports.all = function (req, res) {
  Playlist.find({user: req.profile._id})
    .sort('-created')
    .populate('user', 'name lastname username')
    .exec(function (err, playlists) {
      if (err) {
        return res.send({
          errors: err.errors,
          status: 500
        });
      } else {
        return res.jsonp(playlists);
      }
    });
};
