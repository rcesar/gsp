//=============================================================================
// I18N CONFIGURATION
//=============================================================================
'use strict';

var prop = require('app-config');
var i18n = require('i18n');
var i18nConfig = {};

/**
 * Configure application resource bundles.
 * @param app - Express instance initialized.
 */
i18nConfig.init = function(app) {

	if (!app) {
		throw (prop.config.message.routes.missing_application);
	}

	i18n.configure({
		//Setup some locales
		locales: prop.config.i18n.locales,
		//Define default locale
		defaultLocale: prop.config.i18n.defaultLocale,
		//Define where to store json files
		directory: prop.config.i18n.base_directory + prop.config.i18n.bundles_directory,
		//Wwhether to write new locale information to disk
		updateFiles: prop.config.i18n.updateFiles,
		//What to use as the indentation unit
		indent: '\t',
		// setting extension of json files
		extension: '.json'
	});

    //Verify JSON file consistency before initialize i18n
	if (validateLocalesFiles(prop.config.i18n.locales)) {
		app.use(i18n.init);
	} else {
		throw prop.config.message.i18n.json_file_with_invalid_format;
	}

};

module.exports = i18nConfig;


/**
 * Verify JSON file consistency.
 * @param locales - Locales accepted by application.
 */
function validateLocalesFiles(locales) {
	for (var i = 0; i < locales.length; i++) {
		try {
			var jsonFile = require('./' + prop.config.i18n.bundles_directory + '/' + locales[i] + '');
			JSON.parse(JSON.stringify(jsonFile));
		} catch (e) {
			return false;
		}
	}
	return true;
}