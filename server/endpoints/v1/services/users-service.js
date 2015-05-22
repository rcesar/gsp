//=============================================================================
// USER SERVICE
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var randomstring = require('just.randomstring');
var defaultStorage = require('../../../database/default-storage');
var errorUtils = require('../../../utils/error-utils');
var emailService = require('../../../services/email-service');
var Users = require('../schemas/users-schema');
var UsersService = {};

/**
 * Find user by id.
 * @param userId - User id object.
 * @param callback - Callback function.
 * @return user object from database.
 */
UsersService.findById = function(executeForDomain, userId, callback) {
	return defaultStorage.findById(executeForDomain, userId, Users, callback);
};

/**
 * Find all users.
 * @param fromPage - Page number.
 * @param changeAfter - Filter by change date.
 * @param callback - Callback function.
 * @return users objects from database.
 */
UsersService.findAll = function(executeForDomain, fromPage, changeAfter, limit, parentId, sortBy, callback) {
	return defaultStorage.findAll(executeForDomain, fromPage, changeAfter, limit, parentId, Users, sortBy, callback);
};

/**
 * Save one user and send e-mail with password.
 * @param userJSON - User object to save.
 * @param callback - Callback function.
 * @return user object from database.
 */
UsersService.save = function(executeForDomain, userJSON, callback) {
	userJSON.password = randomstring(6);
	defaultStorage.save(executeForDomain, new Users(userJSON), function(err, userFromDB) {
		if (err) {
			callback(err);
			return;
		} else {
			emailService.sendPasswordToUsers(userFromDB, userJSON.password, function(err) {
				if (err) {
					callback(err);
					return;
				} else {
					callback(null, userFromDB);
					return;
				}
			});
		}
	});
};

/**
 * Update one user.
 * @param userId - User id.
 * @param userJSON - User object to save.
 * @param callback - Callback function.
 * @return userId - Updated user id.
 */
UsersService.update = function(executeForDomain, userId, userJSON, loggedUserId, callback) {
	userJSON.domainName = executeForDomain;
	new Users(userJSON).validate(function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			defaultStorage.findById(executeForDomain, userId, Users, function(err, userById) {
				if (err) {
					callback(err);
					return;
				} else {
					if (!userById) {
						callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').users_not_found));
						return;
					} else {
						if (userId.toString() === loggedUserId.toString() && userJSON.active === false && userById.active === true) {
							callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').users_you_can_not_deactivate_yourself));
							return;
						} else {
							defaultStorage.findOneByCriteria({
								'username': userJSON.username,
								'domainName': executeForDomain.toUpperCase()
							}, Users, function(err, userByCriteria) {
								if (err) {
									callback(err);
									return;
								} else {
									if (userByCriteria && userByCriteria._id.toString() !== userId.toString()) {
										callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').users_update_username_duplicated));
										return;
									} else {
										userJSON.changeDateTime = new Date().getTime();
										userJSON.password = userById.password;
										defaultStorage.update(executeForDomain, userId, userJSON, Users, function(err) {
											if (err) {
												callback(err);
												return;
											} else {
												callback(null, userId);
												return;
											}
										});
									}
								}
							});
						}
					}
				}
			});
		}
	});
};

/**
 * Update one user.
 * @param userId - User id.
 * @param userJSON - User object to save.
 * @param callback - Callback function.
 * @return userId - Updated user id.
 */
UsersService.updatePassword = function(executeForDomain, userId, newPassword, loggedUserId, callback) {
	if (userId.toString() !== loggedUserId.toString()) {
		callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').users_updatePassword_not_update_another_user));
		return;
	} else {
		defaultStorage.findById(executeForDomain, userId, Users, function(err, userFromDB) {
			if (err) {
				callback(err);
				return;
			} else {
				if (!userFromDB) {
					callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').users_not_found));
					return;
				} else {
					defaultStorage.update(executeForDomain, userId, {
						'password': newPassword,
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
							callback(null, userId);
							return;
						}
					});
				}
			}
		});
	}
};

module.exports = UsersService;