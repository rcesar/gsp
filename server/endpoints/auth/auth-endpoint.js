//=============================================================================
// AUTHENTICATION SERVICE FOR BACKOFFICE USERS
//=============================================================================
'use strict';

var jwt = require('jwt-simple');
var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../../utils/json-utils');
var errorUtils = require('../../utils/error-utils');
var AuthService = require('./services/auth-service');

/**
 * Verify if user exists before generate token.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 * @return Json with a valid token and the expiration date.
 */
module.exports = function(req, res, next) {

  if (!req || !res || !req.body) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').auth_users_invalid_request_parameters, 'AuthEndpoint', next);
  }

  var username = req.body.username || '';
  var password = req.body.password || '';
  var domainName = req.body.domainName || '';

  // Verify if user send a correct json in the body of request
  if (username === '' || password === '' || domainName === '') {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').auth_users_invalid_request_parameters, 'AuthEndpoint', next);
  }

  // Verify if user is registered on application database.
  AuthService.findOneUserByCriteria({
    'username': username,
    'password': password,
    'domainName': domainName,
    'active': true
  }, function(err, userFromDB) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.internal_server_error, i18n.__('validation').auth_users_not_found, 'AuthEndpoint', next, err);
    } else {
      if (!userFromDB || !userFromDB.username) {
        return jsonUtils.returnError(prop.config.http.unauthorized, i18n.__('validation').auth_users_not_have_permission, 'AuthEndpoint', next);
      } else {
        try {
          generateToken(userFromDB, function(err, token) {
            if (err) {
              return jsonUtils.returnError(prop.config.http.internal_server_error, i18n.__('validation').auth_users_error_to_generate_token, 'AuthEndpoint', next, err);
            } else {
              return jsonUtils.returnSuccess(null, token, res, null, next);
            }
          });
        } catch (err) {
          return jsonUtils.returnError(prop.config.http.internal_server_error, i18n.__('internal_error').auth_users_fail_to_generate_token, 'AuthEndpoint', next);
        }
      }
    }
  });
};

/**
 * Generate a token for registered users.
 * @param userFromDB - User object from database.
 * @return Json with a valid token and the expiration date.
 */
function generateToken(userFromDB, callback) {

  if (!userFromDB) {
    callback(i18n.__('internal_error').auth_users_fail_to_generate_token);
  }

  var expDate = getExpiresIn();

  //Generate token
  userFromDB.token = getToken(expDate, userFromDB);

  if (!userFromDB.token) {
    callback(i18n.__('internal_error').auth_users_generate_invalid_token);
  }

  //Register token generated on database
  AuthService.registerToken(userFromDB, function(err) {
    if (err) {
      callback(i18n.__('internal_error').auth_users_required_to_generate_token);
    } else {
      callback(null, {
        token: userFromDB.token,
        expires: expDate,
        userId: userFromDB.id
      });
    }
  });
}

/**
 * Generate token.
 * @return token.
 */
function getToken(expDate, userFromDB) {
  return jwt.encode({
    exp: expDate,
    domainName: userFromDB.domainName,
    userId: userFromDB.id
  }, prop.config.auth.jwt_token_secret);
}

/**
 * Define how long token will be valid.
 * @return token expiration date.
 */
function getExpiresIn() {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + prop.config.auth.daysOfTokenValidate);
}