//=============================================================================
// DEFINE ENDPOINTS ROUTES
//=============================================================================
'use strict';
var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../utils/json-utils');
var errorUtils = require('../utils/error-utils');
var funcUtils = require('../utils/func-utils');
var httpUtils = require('../utils/http-utils');
var Endpoint = {};

/**
 * Define generic endpoint for retrieve one information from database.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
Endpoint.findById = function(req, res, next) {
  try {
    httpUtils.validateIdParam(req);
    httpUtils.validateExecuteForDomain(req);
    return funcUtils.getFunc('findById', req, res, next);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').index_error_retrieving_func, 'IndexService.findById', next, err);
  }
};

/**
 * Define generic endpoint for retrieve a list of information from database.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
Endpoint.findAll = function(req, res, next) {
  try {
    httpUtils.validateExecuteForDomain(req);
    return funcUtils.getFunc('findAll', req, res, next);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').index_error_retrieving_func, 'IndexService.findAll', next, err);
  }
};

/**
 * Define generic endpoint for create database structures.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
Endpoint.save = function(req, res, next) {
  try {
    httpUtils.validateBody(req);
    httpUtils.validateToken(req);
    httpUtils.validateExecuteForDomain(req);
    return funcUtils.getFunc('save', req, res, next);
  } catch (err) {
    console.log(err);
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').index_error_retrieving_func, 'IndexService.save', next, err);
  }
};

/**
 * Define generic endpoint for update database structures.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
Endpoint.update = function(req, res, next) {
  try {
    httpUtils.validateBody(req);
    httpUtils.validateIdParam(req);
    httpUtils.validateToken(req);
    httpUtils.validateExecuteForDomain(req);
    return funcUtils.getFunc('update', req, res, next);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').index_error_retrieving_func, 'IndexService.update', next, err);
  }
};

/**
 * Define generic endpoint for remove database structures.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
Endpoint.remove = function(req, res, next) {
  try {
    httpUtils.validateIdParam(req);
    httpUtils.validateExecuteForDomain(req);
    return funcUtils.getFunc('remove', req, res, next);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').index_error_retrieving_func, 'IndexService.remove', next, err);
  }
};

/**
 * Define generic endpoint for update database structures.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
Endpoint.action = function(req, res, next) {
  try {
    httpUtils.validateIdParam(req);
    httpUtils.validateExecuteForDomain(req);
    return funcUtils.getFunc('action', req, res, next);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').index_error_retrieving_func, 'IndexService.Action', next, err);
  }
};

module.exports = Endpoint;