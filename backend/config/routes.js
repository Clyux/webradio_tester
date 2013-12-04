'use strict';

module.exports = function (app, passport, auth) {
  // User Routes
  var users = require('../controllers/users');

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);

  // Article Routes
  var articles = require('../controllers/articles');
  app.post('/articles', auth.requiresLogin, articles.create);

  /*
   app.get('/signin', users.signin);
   app.get('/signup', users.signup);
   app.get('/signout', users.signout);

   //Setting up the users api
   app.post('/users', users.create);

   app.post('/users/session', passport.authenticate('local', {
   failureRedirect: '/signin',
   failureFlash: 'Invalid email or password.'
   }), users.session);

   app.get('/users/me', users.me);

   //Finish with setting up the userId param
   app.param('userId', users.user);

   //Article Routes
   var articles = require('../app/controllers/articles');
   app.get('/articles', articles.all);
   app.post('/articles', auth.requiresLogin, articles.create);
   app.get('/articles/:articleId', articles.show);
   app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
   app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

   //Finish with setting up the articleId param
   app.param('articleId', articles.article);
   */

  var soundCloud = require('../controllers/soundCloud');
  app.get('/soundcloud/auth/callback', soundCloud.getCallback);

  // Application API
  var api = require('../controllers/api');
  app.get('/init_application', api.initApplication);

  // Home route
  var index = require('../controllers/index');
  app.get('/', index.render);

  // redirect all others to the index (HTML5 history)
  app.get('*', index.render);
};
