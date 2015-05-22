//=============================================================================
// AUTHORIZATION SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var defaultStorage = require('../../../database/default-storage');
var Users = require('../../v1/schemas/users-schema');
var errorUtils = require('../../../utils/error-utils');
var AuthService = {};

/**
 * Find one user by name and password.
 * @param username - Username to filter result.
 * @param password - Password to filter result.
 * @param callback - Callback function.
 * @return user object from database.
 */
AuthService.findOneUserByCriteria = function(criteria, callback) {
	//FIX ME password should be encrypted
	if (!criteria || !criteria.domainName) {
		callback(errorUtils.getValidationError(prop.config.http.internal_server_error, i18n.__('validation').token_criteria_invalid));
		return;
	} else {
		return defaultStorage.findOneByCriteria(criteria, Users, callback);			
	}
};

/**
 * Associate a token to one user.
 * @param user - User object to save.
 * @param callback - Callback function.
 * @return user object from database.
 */
AuthService.registerToken = function(user, callback) {
	return defaultStorage.findOneAndUpdate(null, user.id, {
		'token': user.token
	}, Users, callback);
};

module.exports = AuthService;