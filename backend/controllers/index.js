'use strict';

/**
 * Module dependencies.
 */

exports.render = function (req, res) {
  console.log('Index render');
  console.log(req.user);

  res.render('index.html', {
    user: req.user ? JSON.stringify(req.user) : "null"
  });
};
