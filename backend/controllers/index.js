'use strict';

/**
 * Module dependencies.
 */

var path = require('path');

function renderIndex(req, res) {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
}

exports.render = function (req, res) {
  renderIndex(req, res);
};

exports.renderView = function (req, res) {
  // If there is a partials to serve
  if (req.params[0]) {
    res.render(path.join('partials', req.params[0]));
  } else {
    renderIndex(req, res);
  }
};
