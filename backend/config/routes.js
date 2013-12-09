'use strict';

module.exports = function (app, passport, auth) {
  // User Routes
  var users = require('../controllers/users')(passport);
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/signout', users.signout);

  //Setting up the users api
  app.post('/users', users.create);


  app.post('/users/session', users.session);

  app.get('/users/me', users.me);

  //Finish with setting up the userId param
  app.param('userId', users.user);

  // Article Routes
  var articles = require('../controllers/articles');
  app.post('/articles', auth.requiresLogin, articles.create);

  /*
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

  // Get all the partials
  app.get('/partials/*', index.renderView);

  app.get('/', index.render);

  // redirect all others to the index (HTML5 history)
  app.get('*', index.render);
};
