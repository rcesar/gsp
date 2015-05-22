//=============================================================================
// START THE SERVER
//=============================================================================
var prop = require('app-config');
var i18n = require('i18n');
var LogUtils = require('./server/utils/log-utils');

// Verify NODE_ENV variable value required to load config properties
if (!prop.config) {
	LogUtils.logInfo('You must define NODE_ENV variable with (dev, qa or prd) before start the server.');
} else {
	// Define server port before start application
	var port = process.env.NODE_PORT || prop.config.port;
	// Define application configurations
	var server = require('./server/app')();
	server.listen(port);
	console.log(prop.config.message.server.listening, port, '...');
}