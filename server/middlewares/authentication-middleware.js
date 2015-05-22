//=============================================================================
// MIDDLEWARE TO VALIDATE TOKEN IN API CALLS
//=============================================================================
'use strict';
var prop = require('app-config');
var jwt = require('jwt-simple');
var i18n = require('i18n');
var jsonUtils = require('../utils/json-utils');
var errorUtils = require('../utils/error-utils');
var AuthService = require('../endpoints/auth/services/auth-service');

/**
 * Validate token in API calls.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Next function to execute.
 */
module.exports = function(req, res, next) {
  //Verify if there is a token on request path
  var token = (req.query && req.query.token);

  if (token) {
    var decoded;
    try {
      //Decoded token sent by user
      decoded = jwt.decode(token, prop.config.auth.jwt_token_secret);
    } catch (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').auth_users_request_token_invalid, 'AuthenticationMiddleware', next, err);
    }
    try {
      //Validate expiration date of token
      if (decoded.exp <= Date.now()) {
        return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').auth_users_request_token_expired, 'AuthenticationMiddleware', next);
      } else {
        //Verify token on application database
        AuthService.findOneUserByCriteria({
          'token': token,
          'domainName': decoded.domainName,
          'active': true
        }, function(err, userFromDB) {
          if (err) {
            return jsonUtils.returnError(prop.config.http.internal_server_error, i18n.__('validation').auth_users_request_internal_error_try_again, 'AuthenticationMiddleware', next, err);
          } else {
            if (!userFromDB || !userFromDB.username) {
              return jsonUtils.returnError(prop.config.http.unauthorized, i18n.__('validation').auth_users_request_do_not_have_permission, 'AuthenticationMiddleware', next);
            } else {
              if (userFromDB.domainName !== decoded.domainName) {
                return jsonUtils.returnError(prop.config.http.unauthorized, i18n.__('validation').auth_users_request_invalid_token, 'AuthenticationMiddleware', next);
              } else {
                //FIX ME Move to authorization service
                if ('ROOT' === userFromDB.role || 'root' === userFromDB.role) {
                  if (!req.query.executeForDomain) {
                    return jsonUtils.returnError(prop.config.http.unauthorized, i18n.__('validation').http_utils_invalid_executeForDomain_request_parameters, 'AuthenticationMiddleware', next);
                  } else {
                    req.executeForDomain = req.query.executeForDomain;
                  }
                } else {
                  req.executeForDomain = userFromDB.domainName;
                }
                req.loggedUserId = userFromDB._id;
                return next();
              }
            }
          }
        });
      }
    } catch (err) {
      return jsonUtils.returnError(prop.config.http.internal_server_error, i18n.__('validation').auth_users_request_internal_error_try_again, 'AuthenticationMiddleware', next, err);
    }
  } else {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').auth_users_request_token_null, 'AuthenticationMiddleware', next);
  }

};