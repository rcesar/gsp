//=============================================================================
// SERVICE FOR CREATE, RETRIEVE, UPDATE AND DELETE USERS
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../../utils/json-utils');
var httpUtils = require('../../utils/http-utils');
var usersService = require('./services/users-service');
var UsersEndpoint = {};

/**
 * Find one backoffice user by id.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
UsersEndpoint.findById = function(req, res, next) {

  usersService.findById(req.executeForDomain, req.params.id, function(err, user) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_findById_error, 'UsersEndpoint.findById', next, err);
    } else {
      if (user) {
        jsonUtils.removeUserPassword(user);
        return jsonUtils.returnSuccess(null, user, res, null, next);
      } else {
        return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_not_found, 'UsersEndpoint.findById', next, err);
      }
    }
  });
};

/**
 * List all backoffice users.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
UsersEndpoint.findAll = function(req, res, next) {

  var changeAfter;
  var fromPage;
  var limit;
  var sortBy;
  try {
    changeAfter = httpUtils.getChangeAfter(req);
    fromPage = httpUtils.getFromPage(req);
    limit = httpUtils.getLimit(req);
    sortBy = httpUtils.getSortBy(req);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_invalid_parameters, 'UsersEndpoint.findAll', next, err);
  }

  usersService.findAll(req.executeForDomain, fromPage, changeAfter, limit, null, sortBy, function(err, users) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_findAll_error, 'UsersEndpoint.findAll', next, err);
    } else {
      jsonUtils.removeUsersPassword(users);
      return jsonUtils.returnSuccess(null, users, res, null, next);
    }
  });
};

/**
 * Save a backoffice user.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
UsersEndpoint.save = function(req, res, next) {
  usersService.save(req.executeForDomain, req.body, function(err, user) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_save_error, 'UsersEndpoint.save', next, err);
    } else {
      return jsonUtils.returnSuccess(user._id, null, res, prop.config.http.created, next);
    }
  });
};

/**
 * Update a backoffice user.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
UsersEndpoint.update = function(req, res, next) {

  usersService.update(req.executeForDomain, req.params.id, req.body, req.loggedUserId, function(err, userId) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_update_error, 'UsersEndpoint.update', next, err);
    } else {
      return jsonUtils.returnSuccess(userId, null, res, null, next);
    }
  });
};

/**
 * Update a backoffice user.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
UsersEndpoint.updatePassword = function(req, res, next) {

  try {
    httpUtils.validateNewPassword(req);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_updatePassword_invalid_newPassword_parameter, 'UsersEndpoint.updatePassword', next, err);
  }

  usersService.updatePassword(req.executeForDomain, req.params.id, req.body.newPassword, req.loggedUserId, function(err, userId) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').users_updatePassword_error, 'UsersEndpoint.updatePassword', next, err);
    } else {
      return jsonUtils.returnSuccess(userId, null, res, null, next);
    }
  });
};

module.exports = UsersEndpoint;