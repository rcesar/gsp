//=============================================================================
// UTILS METHODS TO HANDLE JSON
//=============================================================================
'use strict';
var prop = require('app-config');
var i18n = require('i18n');
var errorUtils = require('./error-utils');
var JSONUtils = {};

/**
 * Return a successfull JSON.
 * @param objId - Object id.
 * @param jsonToReturn - Object to return.
 * @param next - Callback.
 * @param res - Response object.
 */
JSONUtils.returnSuccess = function(objId, jsonToReturn, res, status, next) {

    if (!next || !res || (!objId && !jsonToReturn)) {
        throw i18n.__('validation').json_utils_invalid_parameters;
    }

    if (status) {
        if (objId) {
            res.status(status).send({
                _id: objId
            });
        } else if (jsonToReturn) {
            res.status(status).send(jsonToReturn);
        }
    } else {
        if (objId) {
            res.json({
                _id: objId
            });
        } else if (jsonToReturn) {
            res.json(jsonToReturn);
        }
    }
    return next();
};

/**
 * Return a error JSON.
 * @param httpStatus - HTTP status.
 * @param errorMessage - Error message.
 * @param logMessage - Log message.
 * @param next - Callback.
 * @param errorObj - Error object.
 */
JSONUtils.returnError = function(httpStatus, errorMessage, origin, next, errorObj) {

   if (!httpStatus || !errorMessage || !origin || !next) {
        throw i18n.__('internal_error').error_utils_invalid_parameters;
    }

    if (errorObj && errorObj.name === prop.config.error.validation_error) {
        return next(errorObj);
    } else {
        var fullErrorObj = {
            external: errorUtils.getError(httpStatus, errorMessage),
            internal: errorObj,
            origin: origin
        };
        return next(fullErrorObj);
    }
};

JSONUtils.removeUsersPassword = function(users) {
    if (users && users.length > 0) {
        for (var i = 0; i < users.length; i++) {
            users[i] = JSONUtils.removeUserPassword(users[i]);
        }
    }
    return users;
};

JSONUtils.removeUserPassword = function(user) {
    if (user && user.password) {
        user.password = undefined;
    }
    return user;
};

exports = module.exports = JSONUtils;