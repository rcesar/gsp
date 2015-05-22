//=============================================================================
// STORAGE
//=============================================================================
'use strict';

var errorUtils = require('../utils/error-utils');
var prop = require('app-config');
var i18n = require('i18n');
var Storage = {};

/**
 * Find one resource by id.
 * @param objectId - ObjectId.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resource from database.
 */
Storage.findById = function(executeForDomain, objectId, schema, callback) {
    if (!objectId || !objectId.match(/^[0-9a-fA-F]{24}$/)) {
        callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').storage_objectId_invalid));
        return;
    }
    return schema.findOne({
        $and: [{
            '_id': objectId
        }, {
            'domainName': executeForDomain
        }]
    }, callback);
};

/**
 * Find all resources.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resources from database.
 */
Storage.findAll = function(executeForDomain, fromPage, changeAfter, limit, onlyParents, schema, sortBy, callback) {
    var criteria = {};
    if (changeAfter && onlyParents) {
        criteria = {
            $and: [{
                'changeDateTime': {
                    $gt: changeAfter
                }
            }, {
                'parentId': {
                    $exists: false
                }
            }, {
                'domainName': executeForDomain
            }]
        };
    } else if (changeAfter) {
        criteria = {
            $and: [{
                'changeDateTime': {
                    $gt: changeAfter
                }
            }, {
                'domainName': executeForDomain
            }]
        };
    } else if (onlyParents) {
        criteria = {
            $and: [{
                'parentId': {
                    $exists: false
                }
            }, {
                'domainName': executeForDomain
            }]
        };
    } else {
        criteria = {
            'domainName': executeForDomain
        };
    }

    schema.find(criteria).sort(sortBy).skip(fromPage).limit(limit).exec(function(err, result) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(null, result);
            return;
        }
    });
};

/**
 * Find by one resource by criteria.
 * @param criteria - Criteria.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resource from database.
 */
Storage.findOneByCriteria = function(criteria, schema, callback) {

    if (!criteria) {
        callback(errorUtils.getValidationError(prop.config.http.bad_request, i18n.__('validation').storage_findOneByCriteria_null));
        return;
    }

    return schema.findOne(criteria, callback);
};

/**
 * Save one resource.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resource saved on database.
 */
Storage.save = function(executeForDomain, schema, callback) {
    schema.domainName = executeForDomain;
    return schema.save(callback);
};

/**
 * Find one resource and update.
 * @param objectId - Resource id to be updated.
 * @param objToUpdate - Object to be updated.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resource updated on database.
 */
Storage.findOneAndUpdate = function(executeForDomain, objectId, objToUpdate, schema, callback) {
    if (executeForDomain) {
        objToUpdate.domainName = executeForDomain;
    }

    return schema.findOneAndUpdate({
        _id: objectId
    }, objToUpdate, callback);
};

//FIX ME Add $set to update a simple information like password.

/**
 * Update one resource.
 * @param objectId - Resource id to be updated.
 * @param objToUpdate - Object to be updated.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resource updated on database.
 */
Storage.update = function(executeForDomain, objectId, objToUpdate, schema, callback) {
    objToUpdate.domainName = executeForDomain;
    return schema.update({
        _id: objectId
    }, objToUpdate, null, callback);
};

/**
 * Remove one resource.
 * @param objectId - Resource id to be removed.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resource removed from database.
 */
Storage.remove = function(executeForDomain, objectId, schema, callback) {
    return schema.remove({
        $and: [{
            '_id': objectId
        }, {
            'domainName': executeForDomain
        }]
    }, callback);
};

/**
 * Find all resources.
 * @param schema - Schema to be executed.
 * @param callback - Callback function.
 * @return resources from database.
 */
Storage.findByParentId = function(executeForDomain, fromPage, changeAfter, limit, parentId, schema, sortBy, callback) {

    var criteria = {};
    if (changeAfter) {
        criteria = {
            $and: [{
                'changeDateTime': {
                    $gt: changeAfter
                }
            }, {
                'parentId': parentId
            }, {
                'domainName': executeForDomain
            }]
        };
    } else {
        criteria = {
            $and: [{
                'parentId': parentId
            }, {
                'domainName': executeForDomain
            }]
        };
    }

    schema.find(criteria).sort(sortBy).skip(fromPage).limit(limit).exec(function(err, result) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(null, result);
            return;
        }
    });
};

module.exports = Storage;