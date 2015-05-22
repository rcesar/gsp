//=============================================================================
// SERVICE FOR CREATE, RETRIEVE, UPDATE AND DELETE CUSTOMERS
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../../utils/json-utils');
var httpUtils = require('../../utils/http-utils');
var customersService = require('./services/customers-service');
var CustomersEndpoint = {};

/**
 * Find one backoffice customer by id.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
CustomersEndpoint.findById = function(req, res, next) {

  customersService.findById(req.executeForDomain, req.params.id, function(err, customer) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').customers_findById_error, 'CustomersEndpoint.findById', next, err);
    } else {
      if (customer) {
        return jsonUtils.returnSuccess(null, customer, res, null, next);
      } else {
        return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').customers_not_found, 'CustomersEndpoint.findById', next, err);
      }
    }
  });
};

/**
 * List all backoffice customers.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
CustomersEndpoint.findAll = function(req, res, next) {

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
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').customers_invalid_parameters, 'CustomersEndpoint.findAll', next, err);
  }

  customersService.findAll(req.executeForDomain, fromPage, changeAfter, limit, null, sortBy, function(err, customers) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').customers_findAll_error, 'CustomersEndpoint.findAll', next, err);
    } else {
      return jsonUtils.returnSuccess(null, customers, res, null, next);
    }
  });
};

/**
 * Save a backoffice customer.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
CustomersEndpoint.save = function(req, res, next) {

  customersService.save(req.executeForDomain, req.body, function(err, customer) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').customers_save_error, 'CustomersEndpoint.save', next, err);
    } else {
      return jsonUtils.returnSuccess(customer._id, null, res, prop.config.http.created, next);
    }
  });
};

/**
 * Update a backoffice customer.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
CustomersEndpoint.update = function(req, res, next) {

  customersService.update(req.executeForDomain, req.params.id, req.body, function(err, customerId) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').customers_update_error, 'CustomersEndpoint.update', next, err);
    } else {
      return jsonUtils.returnSuccess(customerId, null, res, null, next);
    }
  });
};

module.exports = CustomersEndpoint;