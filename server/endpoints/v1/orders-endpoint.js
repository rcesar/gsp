//=============================================================================
// SERVICE FOR CREATE, RETRIEVE, UPDATE AND DELETE ORDERS
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../../utils/json-utils');
var httpUtils = require('../../utils/http-utils');
var ordersService = require('./services/orders-service');
var OrdersEndpoint = {};

/**
 * Find one backoffice order by id.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
OrdersEndpoint.findById = function(req, res, next) {

  ordersService.findById(req.executeForDomain, req.params.id, function(err, order) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_findById_error, 'OrdersEndpoint.findById', next, err);
    } else {
      if (order) {
        return jsonUtils.returnSuccess(null, order, res, null, next);
      } else {
        return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_not_found, 'OrdersEndpoint.findById', next, err);
      }
    }
  });
};

/**
 * List all backoffice orders.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
OrdersEndpoint.findAll = function(req, res, next) {

  var changeAfter;
  var fromPage;
  var limit;
  var onlyParents;
  var sortBy;
  try {
    changeAfter = httpUtils.getChangeAfter(req);
    fromPage = httpUtils.getFromPage(req);
    limit = httpUtils.getLimit(req);
    sortBy = httpUtils.getSortBy(req);
    onlyParents = httpUtils.getOnlyParents(req);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_invalid_parameters, 'OrdersEndpoint.findAll', next, err);
  }

  ordersService.findAll(req.executeForDomain, fromPage, changeAfter, limit, onlyParents, sortBy, function(err, orders) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_findAll_error, 'OrdersEndpoint.findAll', next, err);
    } else {
      return jsonUtils.returnSuccess(null, orders, res, null, next);
    }
  });
};

/**
 * Save a backoffice order.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
OrdersEndpoint.save = function(req, res, next) {

  ordersService.save(req.executeForDomain, req.body, function(err, order) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_save_error, 'OrdersEndpoint.save', next, err);
    } else {
      return jsonUtils.returnSuccess(order._id, null, res, prop.config.http.created, next);
    }
  });
};

/**
 * Update a backoffice order.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
OrdersEndpoint.update = function(req, res, next) {

  ordersService.update(req.executeForDomain, req.params.id, req.body, function(err, orderId) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_update_error, 'OrdersEndpoint.update', next, err);
    } else {
      return jsonUtils.returnSuccess(orderId, null, res, null, next);
    }
  });
};

/**
 * List all backoffice orders by parent id.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
OrdersEndpoint.findByParentId = function(req, res, next) {

  var changeAfter;
  var fromPage;
  var limit;
  var parentId;
  var sortBy;
  try {
    changeAfter = httpUtils.getChangeAfter(req);
    fromPage = httpUtils.getFromPage(req);
    limit = httpUtils.getLimit(req);
    sortBy = httpUtils.getSortBy(req);
    httpUtils.validateIdParam(req);
  } catch (err) {
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_invalid_parameters, 'OrdersEndpoint.findAll', next, err);
  }
  ordersService.findByParentId(req.executeForDomain, fromPage, changeAfter, limit, req.params.id, sortBy, function(err, orders) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').orders_findAll_error, 'OrdersEndpoint.findAll', next, err);
    } else {
      return jsonUtils.returnSuccess(null, orders, res, null, next);
    }
  });
};

module.exports = OrdersEndpoint;