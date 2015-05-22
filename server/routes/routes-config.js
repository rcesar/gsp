//=============================================================================
// DEFINE APP ROUTES
//=============================================================================
'use strict';
var i18n = require('i18n');
var prop = require('app-config');
var path = require('path');
var endpoints = require('../endpoints');
var authEndpoint = require('../endpoints/auth/auth-endpoint');
var passwordEndpoint = require('../endpoints/password/password-endpoint');
var routesConfig = {};

/**
 * Configure application routes.
 * @param app - Express instance initialized.
 */
routesConfig.init = function(app) {

  if (!app) {
    throw (prop.config.message.routes.missing_application);
  }

  // Define basic HTTP configuration for rest endpoints
  app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', prop.config.http.allow_origin);
    res.header('Access-Control-Allow-Methods', prop.config.http.allowed_methods);
    res.header('Access-Control-Allow-Headers', prop.config.http.allowed_headers);
    //res.setHeader("content-type", "application/json")
    //res.end(JSON.stringify(res));
    if (req.method == 'OPTIONS') {
      res.status(prop.config.http.ok).end();
    } else {
      next();
    }
  });

  // Apply a middleware to validate application token.
  app.all(prop.config.path.apply_authentication_all_endpoints, [require('../middlewares/authentication-middleware')]);

  // Apply a middleware to validate resource permission.
  app.all(prop.config.path.apply_authorization_all_endpoints, [require('../middlewares/authorization-middleware')]);

  // Get token operation for admins and consultants.
  app.post('/api/authentication', authEndpoint);

  app.post('/api/renewPassword', passwordEndpoint);

  app.get('/api/:version/:endpoint', endpoints.findAll);
  app.get('/api/:version/:endpoint/:id', endpoints.findById);
  app.post('/api/:version/:endpoint', endpoints.save);
  app.put('/api/:version/:endpoint/:id', endpoints.update);
  app.delete('/api/:version/:endpoint/:id', endpoints.remove);
  app.put('/api/:version/:endpoint/:action/:id', endpoints.action);
  app.get('/api/:version/:endpoint/:action/:id', endpoints.action);
};

module.exports = routesConfig;