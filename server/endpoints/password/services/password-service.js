//=============================================================================
// PASSWORD SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var randomstring = require('just.randomstring');
var defaultStorage = require('../../../database/default-storage');
var errorUtils = require('../../../utils/error-utils');
var emailService = require('../../../services/email-service');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var PasswordService = {};

/**
 * Renew user password.
 * @param executeForDomain - User domain.
 * @param username - User name.
 * @param callback - Callback function.
 */
PasswordService.renewPassword = function(executeForDomain, username, callback) {

	defaultStorage.findOneByCriteria({
		'username': username,
		'domainName': executeForDomain.toUpperCase()
	}, Users, function(err, userFromDB) {
		if (err) {
			callback(err);
			return;
		} else {
			if (!userFromDB || !userFromDB.username) {
				callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').users_username_password_domain_not_found));
				return;
			} else {
				var password = randomstring(6);
				defaultStorage.update(executeForDomain, userFromDB._id, {
					'password': password,
					'username': userFromDB.username,
					'role': userFromDB.role,
					'domainName': userFromDB.domainName,
					'changeDateTime': new Date().getTime(),
					'fullName': userFromDB.fullName,
					'nickName': userFromDB.nickName,
					'timeZone': userFromDB.timeZone,
					'cpf': userFromDB.cpf,
					'phone': userFromDB.phone,
					'userPhoto': userFromDB.userPhoto,
					'active': userFromDB.active
				}, Users, function(err) {
					if (err) {
						callback(err);
						return;
					} else {
						emailService.sendPasswordToUsers(userFromDB, password, function(err) {
							if (err) {
								callback(err);
								return;
							} else {
								callback();
								return;
							}
						});
					}
				});
			}
		}
	});
};

module.exports = PasswordService;