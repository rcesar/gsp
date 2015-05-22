//=============================================================================
// UTILS METHODS TO HANDLE REQUESTS AND RESPONSES
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var jsonUtils = require('./json-utils');
var errorUtils = require('./error-utils');
var HTTPUtils = {};

/**
 * Validate request body.
 * @param req - HTTP Request object.
 * @throws error.
 */
HTTPUtils.validateBody = function(req) {

	if (!req || !req.body) {
		throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_body);
	} else {
		if (req.body._id) {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_body_id);
		}
		if (req.body.changeDateTime) {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_body_changeDateTime);
		}
		if (req.body.createDateTime) {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_body_createDateTime);
		}
	}
};

/**
 * Validate request id parameter.
 * @param req - HTTP Request object.
 * @throws error.
 */
HTTPUtils.validateIdParam = function(req) {
	if (!req || !req.params || !req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
		throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_parameter_id);
	}
};

/**
 * Validate body username.
 * @param req - HTTP Request object.
 * @throws error.
 */
HTTPUtils.validateBodyUsername = function(req) {
	if (!req || !req.body || !req.body.username || !req.body.username.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/)) {
		throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_body_username);
	}
};

/**
 * Validate body username.
 * @param req - HTTP Request object.
 * @throws error.
 */
HTTPUtils.validateNewPassword = function(req) {
	if (!req || !req.body || !req.body.newPassword || req.body.newPassword.length < 5 || req.body.newPassword.length > 8) {
		throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_body_newPassword);
	}
};

/**
 * Validate body domain.
 * @param req - HTTP Request object.
 * @throws error.
 */
HTTPUtils.validateBodyDomainName = function(req) {
	if (!req || !req.body || !req.body.domainName || !req.body.domainName.match(/^[0-9A-Za-z_]{3,20}$/)) {
		throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_body_domainName);
	}
};

/**
 * Validate request domain name parameter.
 * @param req - HTTP Request object.
 * @throws error.
 */
HTTPUtils.validateExecuteForDomain = function(req) {
	if (!req || !req.executeForDomain || !req.executeForDomain.match(/^[0-9A-Za-z_]{3,20}$/)) {
		throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_executeForDomain_request_parameters);
	}
};

/**
 * Get request criteria.
 * @param query - HTTP Request params.
 * @throws error.
 */
HTTPUtils.getChangeAfter = function(req) {
	if (req && req.query && req.query.changeAfter) {
		if (req.query.changeAfter.match(/^[0-9]{12,14}$/)) {
			return req.query.changeAfter;
		} else {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_parameters_changeAfter);
		}
	}
	return;
};

/**
 * Get request fromPage parameter.
 * @param query - HTTP Request params.
 * @throws error.
 */
HTTPUtils.getFromPage = function(req) {
	if (req && req.query && req.query.fromPage) {
		if (req.query.fromPage.match(/^[0-9]{1,9}$/)) {
			return req.query.fromPage;
		} else {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_parameters_fromPage);
		}
	}
	return prop.config.database.default_fromPage;
};

/**
 * Get request limit parameter.
 * @param query - HTTP Request params.
 * @throws error.
 */
HTTPUtils.getLimit = function(req) {
	if (req && req.query && req.query.limit) {
		if (req.query.limit.match(/^[0-9]{1,9}$/)) {
			if (req.query.limit > 100) {
				return prop.config.database.default_limit;
			} else {
				return req.query.limit;
			}
		} else {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_parameters_limit);
		}
	}
	return prop.config.database.default_limit;
};

/**
 * Get request sortBy parameter.
 * @param query - HTTP Request params.
 * @throws error.
 */
HTTPUtils.getSortBy = function(req) {
	if (req && req.query && req.query.sortBy) {
		if (req.query.sortBy.match(/^[A-Za-z]{1,30}$/)) {
			return req.query.sortBy;
		} else {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_parameters_sortBy);
		}
	}
	return prop.config.database.default_sort;
};

/**
 * Get request onlyParents parameter.
 * @param query - HTTP Request params.
 * @throws error.
 */
HTTPUtils.getOnlyParents = function(req) {
	if (req && req.query && req.query.onlyParents) {
		if (req.query.onlyParents.match(/^(true|TRUE)$/)) {
			return true;
		} else if (req.query.onlyParents.match(/^(false|FALSE)$/)) {
			return false;
		} else {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_parameters_onlyParents);
		}
	}
	return false;
};

/**
 * Validate request body.
 * @param req - HTTP Request object.
 * @throws error.
 */
HTTPUtils.validateToken = function(req) {
	if (!req || !req.body) {
		throw i18n.__('validation').http_utils_invalid_request_parameters;
	} else {
		if (req.body.token) {
			throw errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').http_utils_invalid_request_parameter_token);
		}
	}
};

exports = module.exports = HTTPUtils;