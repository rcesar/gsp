//=============================================================================
// MIDDLEWARE TO VALIDATE ADMIN TOKEN FOR USERS SERVICE
//=============================================================================
'use strict';
var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../utils/json-utils');
var PermissionService = require('../services/permission-service');

/**
 * Verify service permission.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Next function to execute.
 */
module.exports = function(req, res, next) {
  PermissionService.verifyServicePermission(req, function(err) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.unauthorized, i18n.__('validation').authorization_middleware_not_allowed, 'AuthorizationMiddleware', next, err);
    } else {
      return next();
    }
  });
};