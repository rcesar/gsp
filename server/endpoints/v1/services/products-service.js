//=============================================================================
// PRODUCTS SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var randomstring = require('just.randomstring');
var defaultStorage = require('../../../database/default-storage');
var errorUtils = require('../../../utils/error-utils');
var Products = require('../schemas/products-schema');
var ProductsService = {};

/**
 * Find product by id.
 * @param productId - Product id object.
 * @param callback - Callback function.
 * @return product object from database.
 */
ProductsService.findById = function(executeForDomain, productId, callback) {
	return defaultStorage.findById(executeForDomain, productId, Products, callback);
};

/**
 * Find all products.
 * @param fromPage - Page number.
 * @param changeAfter - Filter by change date.
 * @param callback - Callback function.
 * @return products objects from database.
 */
ProductsService.findAll = function(executeForDomain, fromPage, changeAfter, limit, onlyParents, sortBy, callback) {
	return defaultStorage.findAll(executeForDomain, fromPage, changeAfter, limit, onlyParents, Products, sortBy, callback);
};

/**
 * Save one product and send e-mail with password.
 * @param productJSON - Product object to save.
 * @param callback - Callback function.
 * @return product object from database.
 */
ProductsService.save = function(executeForDomain, productJSON, callback) {
	productJSON.domainName = executeForDomain;
	defaultStorage.save(executeForDomain, new Products(productJSON), function(err, productFromDB) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null, productFromDB);
			return;
		}
	});
};

/**
 * Update one product.
 * @param productId - Product id.
 * @param productJSON - Product object to save.
 * @param callback - Callback function.
 * @return productId - Updated product id.
 */
ProductsService.update = function(executeForDomain, productId, productJSON, callback) {

	productJSON.domainName = executeForDomain;
	new Products(productJSON).validate(function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			defaultStorage.findById(executeForDomain, productId, Products, function(err, product) {
				if (err) {
					callback(err);
					return;
				} else {
					if (!product) {
						callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').product_not_found));
						return;
					} else {
						defaultStorage.findOneByCriteria({
							'title': productJSON.title,
							'description': productJSON.description,
							'domainName': executeForDomain.toUpperCase()
						}, Products, function(err, product) {
							if (err) {
								callback(err);
								return;
							} else {
								if (product && product._id.toString() !== productId.toString()) {
									callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').products_update_cnpj_username_duplicated));
									return;
								} else {
									productJSON.changeDateTime = new Date().getTime();
									defaultStorage.update(executeForDomain, productId, productJSON, Products, function(err) {
										if (err) {
											callback(err);
											return;
										} else {
											callback(null, productId);
											return;
										}
									});
								}
							}
						});
					}
				}
			});
		}
	});
};

/**
 * List all backoffice products by parent id.
 * @param fromPage - Page number.
 * @param changeAfter - Filter by change date.
 * @param callback - Callback function.
 * @return products objects from database.
 */
ProductsService.findByParentId = function(executeForDomain, fromPage, changeAfter, limit, parentId, sortBy, callback) {
	return defaultStorage.findByParentId(executeForDomain, fromPage, changeAfter, limit, parentId, Products, sortBy, callback);
};

module.exports = ProductsService;