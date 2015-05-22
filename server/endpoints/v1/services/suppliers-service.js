//=============================================================================
// CUSTOMERS SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var randomstring = require('just.randomstring');
var defaultStorage = require('../../../database/default-storage');
var errorUtils = require('../../../utils/error-utils');
var Suppliers = require('../schemas/suppliers-schema');
var SuppliersService = {};

/**
 * Find supplier by id.
 * @param supplierId - Supplier id object.
 * @param callback - Callback function.
 * @return supplier object from database.
 */
SuppliersService.findById = function(executeForDomain, supplierId, callback) {
	return defaultStorage.findById(executeForDomain, supplierId, Suppliers, callback);
};

/**
 * Find all suppliers.
 * @param fromPage - Page number.
 * @param changeAfter - Filter by change date.
 * @param callback - Callback function.
 * @return suppliers objects from database.
 */
SuppliersService.findAll = function(executeForDomain, fromPage, changeAfter, limit, parentId, sortBy, callback) {
	return defaultStorage.findAll(executeForDomain, fromPage, changeAfter, limit, parentId, Suppliers, sortBy, callback);
};

/**
 * Save one supplier and send e-mail with password.
 * @param supplierJSON - Supplier object to save.
 * @param callback - Callback function.
 * @return supplier object from database.
 */
SuppliersService.save = function(executeForDomain, supplierJSON, callback) {
	supplierJSON.domainName = executeForDomain;
	defaultStorage.save(executeForDomain, new Suppliers(supplierJSON), function(err, supplierFromDB) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null, supplierFromDB);
			return;
		}
	});
};

/**
 * Update one supplier.
 * @param supplierId - Supplier id.
 * @param supplierJSON - Supplier object to save.
 * @param callback - Callback function.
 * @return supplierId - Updated supplier id.
 */
SuppliersService.update = function(executeForDomain, supplierId, supplierJSON, callback) {
	supplierJSON.domainName = executeForDomain;
	new Suppliers(supplierJSON).validate(function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			defaultStorage.findById(executeForDomain, supplierId, Suppliers, function(err, supplier) {
				if (err) {
					callback(err);
					return;
				} else {
					if (!supplier) {
						callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').suppliers_not_found));
						return;
					} else {
						defaultStorage.findOneByCriteria({
							$or: [{
								'supplierName': supplierJSON.supplierName
							}, {
								'cnpjOrCpf': supplierJSON.cnpjOrCpf
							}],
							'domainName': executeForDomain.toUpperCase()
						}, Suppliers, function(err, supplier) {
							if (err) {
								callback(err);
								return;
							} else {
								if (supplier && supplier._id.toString() !== supplierId.toString()) {
									callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').suppliers_update_cnpj_username_duplicated));
									return;
								} else {
									supplierJSON.changeDateTime = new Date().getTime();
									defaultStorage.update(executeForDomain, supplierId, supplierJSON, Suppliers, function(err) {
										if (err) {
											callback(err);
											return;
										} else {
											callback(null, supplierId);
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

module.exports = SuppliersService;