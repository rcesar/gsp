//=============================================================================
// SERVICE FOR CREATE, RETRIEVE, UPDATE AND DELETE PRODUCTS
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('../../utils/json-utils');
var httpUtils = require('../../utils/http-utils');
var productsService = require('./services/products-service');
var ProductsEndpoint = {};

/**
 * Find one backoffice product by id.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
ProductsEndpoint.findById = function(req, res, next) {

  productsService.findById(req.executeForDomain, req.params.id, function(err, product) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_findById_error, 'ProductsEndpoint.findById', next, err);
    } else {
      if (product) {
        return jsonUtils.returnSuccess(null, product, res, null, next);
      } else {
        return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_not_found, 'ProductsEndpoint.findById', next, err);
      }
    }
  });
};

/**
 * List all backoffice products.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
ProductsEndpoint.findAll = function(req, res, next) {

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
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_invalid_parameters, 'ProductsEndpoint.findAll', next, err);
  }

  productsService.findAll(req.executeForDomain, fromPage, changeAfter, limit, onlyParents, sortBy, function(err, products) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_findAll_error, 'ProductsEndpoint.findAll', next, err);
    } else {
      return jsonUtils.returnSuccess(null, products, res, null, next);
    }
  });
};

/**
 * Save a backoffice product.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
ProductsEndpoint.save = function(req, res, next) {

  productsService.save(req.executeForDomain, req.body, function(err, product) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_save_error, 'ProductsEndpoint.save', next, err);
    } else {
      return jsonUtils.returnSuccess(product._id, null, res, prop.config.http.created, next);
    }
  });
};

/**
 * Update a backoffice product.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
ProductsEndpoint.update = function(req, res, next) {

  productsService.update(req.executeForDomain, req.params.id, req.body, function(err, productId) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_update_error, 'ProductsEndpoint.update', next, err);
    } else {
      return jsonUtils.returnSuccess(productId, null, res, null, next);
    }
  });
};

/**
 * List all backoffice products by parent id.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 */
ProductsEndpoint.findByParentId = function(req, res, next) {

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
    return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_invalid_parameters, 'ProductsEndpoint.findAll', next, err);
  }
  productsService.findByParentId(req.executeForDomain, fromPage, changeAfter, limit, req.params.id, sortBy, function(err, products) {
    if (err) {
      return jsonUtils.returnError(prop.config.http.bad_request, i18n.__('validation').products_findAll_error, 'ProductsEndpoint.findAll', next, err);
    } else {
      return jsonUtils.returnSuccess(null, products, res, null, next);
    }
  });
};

module.exports = ProductsEndpoint;