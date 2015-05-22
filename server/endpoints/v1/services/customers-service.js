//=============================================================================
// CUSTOMERS SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var randomstring = require('just.randomstring');
var defaultStorage = require('../../../database/default-storage');
var errorUtils = require('../../../utils/error-utils');
var Customers = require('../schemas/customers-schema');
var CustomersService = {};

/**
 * Find customer by id.
 * @param customerId - Customer id object.
 * @param callback - Callback function.
 * @return customer object from database.
 */
CustomersService.findById = function(executeForDomain, customerId, callback) {
	return defaultStorage.findById(executeForDomain, customerId, Customers, callback);
};

/**
 * Find all customers.
 * @param fromPage - Page number.
 * @param changeAfter - Filter by change date.
 * @param callback - Callback function.
 * @return customers objects from database.
 */
CustomersService.findAll = function(executeForDomain, fromPage, changeAfter, limit, parentId, sortBy, callback) {
	return defaultStorage.findAll(executeForDomain, fromPage, changeAfter, limit, parentId, Customers, sortBy, callback);
};

/**
 * Save one customer and send e-mail with password.
 * @param customerJSON - Customer object to save.
 * @param callback - Callback function.
 * @return customer object from database.
 */
CustomersService.save = function(executeForDomain, customerJSON, callback) {
	customerJSON.domainName = executeForDomain;
	defaultStorage.save(executeForDomain, new Customers(customerJSON), function(err, customerFromDB) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null, customerFromDB);
			return;
		}
	});
};

/**
 * Update one customer.
 * @param customerId - Customer id.
 * @param customerJSON - Customer object to save.
 * @param callback - Callback function.
 * @return customerId - Updated customer id.
 */
CustomersService.update = function(executeForDomain, customerId, customerJSON, callback) {
	customerJSON.domainName = executeForDomain;
	new Customers(customerJSON).validate(function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			defaultStorage.findById(executeForDomain, customerId, Customers, function(err, customer) {
				if (err) {
					callback(err);
					return;
				} else {
					if (!customer) {
						callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').customers_not_found));
						return;
					} else {
						defaultStorage.findOneByCriteria({
							$or: [{
								'customerName': customerJSON.customerName
							}, {
								'cnpjOrCpf': customerJSON.cnpjOrCpf
							}],
							'domainName': executeForDomain.toUpperCase()
						}, Customers, function(err, customer) {
							if (err) {
								callback(err);
								return;
							} else {
								if (customer && customer._id.toString() !== customerId.toString()) {
									callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').customers_update_cnpj_username_duplicated));
									return;
								} else {
									customerJSON.changeDateTime = new Date().getTime();
									defaultStorage.update(executeForDomain, customerId, customerJSON, Customers, function(err) {
										if (err) {
											callback(err);
											return;
										} else {
											callback(null, customerId);
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

module.exports = CustomersService;