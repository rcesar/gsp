//=============================================================================
// COMPANY SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var CompanyService = {};

/**
 * Fake service.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 */
CompanyService.findAll = function(req, res) {
	res.json({
		'message': i18n.__('validation').do_not_have_permission
	});
};

/**
 * Fake service.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 */
CompanyService.findById = function(req, res) {
	res.json({
		'message': i18n.__('validation').do_not_have_permission
	});
};

/**
 * Fake service.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 */
CompanyService.save = function(req, res) {
	res.json({
		'message': i18n.__('validation').do_not_have_permission
	});
};

/**
 * Fake service.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 */
CompanyService.update = function(req, res) {
	res.json({
		'message': i18n.__('validation').do_not_have_permission
	});
};

module.exports = CompanyService;