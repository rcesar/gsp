//=============================================================================
// Orders SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var randomstring = require('just.randomstring');
var defaultStorage = require('../../../database/default-storage');
var errorUtils = require('../../../utils/error-utils');
var Orders = require('../schemas/Orders-schema');
var OrdersService = {};

/**
 * Find order by id.
 * @param orderId - Order id object.
 * @param callback - Callback function.
 * @return order object from database.
 */
OrdersService.findById = function(executeForDomain, orderId, callback) {
	return defaultStorage.findById(executeForDomain, orderId, Orders, callback);
};

/**
 * Find all Orders.
 * @param fromPage - Page number.
 * @param changeAfter - Filter by change date.
 * @param callback - Callback function.
 * @return Orders objects from database.
 */
OrdersService.findAll = function(executeForDomain, fromPage, changeAfter, limit, onlyParents, sortBy, callback) {
	return defaultStorage.findAll(executeForDomain, fromPage, changeAfter, limit, onlyParents, Orders, sortBy, callback);
};

/**
 * Save one order and send e-mail with password.
 * @param orderJSON - Order object to save.
 * @param callback - Callback function.
 * @return order object from database.
 */
OrdersService.save = function(executeForDomain, orderJSON, callback) {
	orderJSON.domainName = executeForDomain;
	if (orderJSON.items && orderJSON.items[0].productId) {
		if (orderJSON.payments && orderJSON.payments[0].totalAmount) {
			defaultStorage.save(executeForDomain, new Orders(orderJSON), function(err, orderFromDB) {
				if (err) {
					callback(err);
					return;
				} else {
					callback(null, orderFromDB);
					return;
				}
			});
		} else {
			callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').orders_payments_null));
			return;
		}
	} else {
		callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').orders_items_null));
		return;
	}
};

/**
 * Update one order.
 * @param orderId - Order id.
 * @param orderJSON - Order object to save.
 * @param callback - Callback function.
 * @return orderId - Updated order id.
 */
OrdersService.update = function(executeForDomain, orderId, orderJSON, callback) {

	orderJSON.domainName = executeForDomain;
	new Orders(orderJSON).validate(function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			defaultStorage.findById(executeForDomain, orderId, Orders, function(err, order) {
				if (err) {
					callback(err);
					return;
				} else {
					if (!order) {
						callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').orders_not_found));
						return;
					} else {
						orderJSON.changeDateTime = new Date().getTime();
						defaultStorage.update(executeForDomain, orderId, orderJSON, Orders, function(err) {
							if (err) {
								callback(err);
								return;
							} else {
								callback(null, orderId);
								return;
							}
						});
					}
				}
			});
		}
	});
};

/**
 * List all backoffice Orders by parent id.
 * @param fromPage - Page number.
 * @param changeAfter - Filter by change date.
 * @param callback - Callback function.
 * @return Orders objects from database.
 */
OrdersService.findByParentId = function(executeForDomain, fromPage, changeAfter, limit, parentId, sortBy, callback) {
	return defaultStorage.findByParentId(executeForDomain, fromPage, changeAfter, limit, parentId, Orders, sortBy, callback);
};

module.exports = OrdersService;