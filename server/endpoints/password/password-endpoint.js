//=============================================================================
// PASSWORD ENDPOINT
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var defaultStorage = require('../../database/default-storage');
var errorUtils = require('../../utils/error-utils');
var jsonUtils = require('../../utils/json-utils');
var httpUtils = require('../../utils/http-utils');
var passwordService = require('./services/password-service');

/**
 * Generate new password for one user.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 * @return userId
 */
module.exports = function(req, res, next) {

  try {
    httpUtils.validateBodyUsername(req);
    httpUtils.validateBodyDomainName(req);
    passwordService.renewPassword(req.body.domainName, req.body.username, function(err) {
      if (err) {
        return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').password_renew_error, 'PasswordEndpoint.renewPassword', next, err);
      } else {
        var jsonToReturn = { 'message': i18n.__('messages').email_renew_password_sent}
        return jsonUtils.returnSuccess(null, jsonToReturn, res, null, next);
      }
    });
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').password_renew_invalid_body, 'PasswordEndpoint.renewPassword', next, err);
  }
};