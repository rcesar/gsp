//=============================================================================
// SERVICE FOR CREATE, RETRIEVE, UPDATE AND DELETE CUSTOMERS
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../../utils/json-utils');
var httpUtils = require('../../utils/http-utils');
var suppliersService = require('./services/suppliers-service');
var SuppliersEndpoint = {};

/**
 * Find one backoffice supplier by id.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
SuppliersEndpoint.findById = function(req, res, next) {

  suppliersService.findById(req.executeForDomain, req.params.id, function(err, supplier) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').suppliers_findById_error, 'SuppliersEndpoint.findById', next, err);
    } else {
      if (supplier) {
        return jsonUtils.returnSuccess(null, supplier, res, null, next);
      } else {
        return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').suppliers_not_found, 'SuppliersEndpoint.findById', next, err);
      }
    }
  });
};

/**
 * List all backoffice suppliers.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
SuppliersEndpoint.findAll = function(req, res, next) {

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
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').suppliers_invalid_parameters, 'SuppliersEndpoint.findAll', next, err);
  }

  suppliersService.findAll(req.executeForDomain, fromPage, changeAfter, limit, null, sortBy, function(err, suppliers) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').suppliers_findAll_error, 'SuppliersEndpoint.findAll', next, err);
    } else {
      return jsonUtils.returnSuccess(null, suppliers, res, null, next);
    }
  });
};

/**
 * Save a backoffice supplier.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
SuppliersEndpoint.save = function(req, res, next) {
  suppliersService.save(req.executeForDomain, req.body, function(err, supplier) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').suppliers_save_error, 'SuppliersEndpoint.save', next, err);
    } else {
      return jsonUtils.returnSuccess(supplier._id, null, res, prop.config.http.created, next);
    }
  });
};

/**
 * Update a backoffice supplier.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
SuppliersEndpoint.update = function(req, res, next) {

  suppliersService.update(req.executeForDomain, req.params.id, req.body, function(err, supplierId) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').suppliers_update_error, 'SuppliersEndpoint.update', next, err);
    } else {
      return jsonUtils.returnSuccess(supplierId, null, res, null, next);
    }
  });
};

module.exports = SuppliersEndpoint;