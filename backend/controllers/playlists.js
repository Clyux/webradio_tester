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
        errors: err,
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
        errors: err,
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
 * List all playlists for the user
 */
exports.all = function (req, res) {
  Playlist.find({user: req.profile._id})
    .sort('-created')
    .populate('user', 'name lastname username')
    .exec(function (err, playlists) {
      if (err) {
        return res.send({
          errors: err,
          status: 500
        });
      } else {
        return res.jsonp(playlists);
      }
    });
};

/**
 * List of playlist
 */
exports.query = function (req, res) {

  var featured = req.query.featured;
  var limit = parseInt(req.query.limit, 10);

  if (limit === undefined || isNaN(limit) || limit <= 0) {
    limit = 5;
  } else if (limit > 100) {
    limit = 100;
  }

  // Just get the featured playlists
  if (featured === '1') {
    Playlist.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$_id', count: { $sum: 1 }, user: { $first: '$user' }, name: { $first: '$name' }, created: { $first: '$created' } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ],
      function (err, results) {
        if (err) {
          return res.send({
            errors: err,
            status: 500
          });
        } else {
          // Populate the playlist with the username
          var promise = Playlist.populate(results, { path: 'user', select: 'username' });
          promise.then(function (playlists) {
            return res.jsonp(playlists);
          }).end();
        }
      });
  } else {
    // Just get the latest playlists
    Playlist.find({})
      .sort('-created')
      .limit(limit)
      .populate('user', 'username')
      .exec(function (err, playlists) {
        if (err) {
          return res.send({
            errors: err,
            status: 500
          });
        } else {
          return res.jsonp(playlists);
        }
      });
  }
};


/*
 // Number of playlists items by user
 db.playlists.aggregate(
 { $unwind: '$items' },
 { $group: { _id: '$user', number: { $sum: 1 } } }
 );

 // Number of playlist by user
 db.playlists.aggregate(
 { $group: { _id: '$user', total: { $sum: 1 } } }
 );

 // Number of playlists items
 db.playlists.aggregate(
 { $unwind: '$items' },
 { $group: { _id: '$_id', count: { $sum: 1 }, user: { $first: '$user' }, name: { $first: '$name' }, created: { $first: '$created' } } },
 { $sort: { count: -1 } },
 { $limit : 5 }
 );
 */