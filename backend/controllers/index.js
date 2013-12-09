'use strict';

/**
 * Module dependencies.
 */

exports.render = function (req, res) {
  console.log('dans /');
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
};
