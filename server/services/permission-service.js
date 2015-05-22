//=============================================================================
// PERMISSION SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var PermisisonService = {};

/**
 * Find user by id.
 * @param userId - User id object.
 * @param callback - Callback function.
 * @return user object from database.
 */
PermisisonService.verifyServicePermission = function(req, callback) {
	//TODO FIX ME
	callback();
	return;
};
/*


  create permission structure on database
  vai na base
  verifica se para esse dominio
  tem acesso a cada servico

  var token = (req.query && req.query.token);

  if (token) {
    try {
      PermissionService.verifyServicePermission(req, function(err, userFromDB) {
        if (err) {
          return jsonUtils.returnError(prop.config.http.internal_server_error, i18n.__('validation').users_service_middleware_internal_error_try_again, 'UsersSeviceMiddleware', next, err);
        } else {
          if (!userFromDB || !userFromDB.username) {
            return jsonUtils.returnError(prop.config.http.unauthorized, i18n.__('validation').users_service_middleware_do_not_have_permission, 'UsersSeviceMiddleware', next);
          } else {
            if (userFromDB.role !== 'admin') {
              return jsonUtils.returnError(prop.config.http.unauthorized, i18n.__('validation').users_service_middleware_do_not_have_permission, 'UsersSeviceMiddleware', next);
            } else {
              return next();
            }
          }
        }
      });
    } catch (err) {
      return jsonUtils.returnError(prop.config.http.internal_server_error, i18n.__('validation').users_service_middleware_internal_error_try_again, 'UsersSeviceMiddleware', next, err);
    }
  } else {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_service_middleware_token_null, 'UsersSeviceMiddleware', next);
  }

	*/

module.exports = PermisisonService;