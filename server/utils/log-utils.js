//=============================================================================
// LOG APPENDER
//=============================================================================
'use strict';
var i18n = require('i18n');
var LogUtils = {};

/**
 * Appender for simple logging.
 * @param logMessage - String message.
 */
LogUtils.logInfo = function(logMessage) {

    if (!logMessage) {
        throw i18n.__('validation').json_utils_invalid_parameters;
    } else {        
        console.log(logMessage);
    }
    return;
};

exports = module.exports = LogUtils;