//=============================================================================
// EMAIL SERVICE
//=============================================================================
'use strict';

var Mandrill = require('mandrill-api/mandrill');
var i18n = require('i18n');
var fs = require('fs');
var prop = require('app-config');
var logUtils = require('../utils/log-utils');
var errorUtils = require('../utils/error-utils');
var EmailService = {};

EmailService.sendPasswordToUsers = function(user, password, callback) {
	if (!user || !user.username || !password) {
		callback(errorUtils.getValidationError(prop.config.http.internal_server_error, i18n.__('validation').email_service_invalid_user));
		return;
	} else {
		fs.readFile('./server/services/templates/send-password-to-users-template.html', function(err, html) {
			if (err) {
				callback(err);
				return;
			} else {
				var message = {
					'html': html.toString().replace('{password}', password).replace('{nickName}', user.nickName),
					'subject': i18n.__('messages').email_subject_send_password_to_users,
					'from_email': prop.config.email.from,
					'from_name': prop.config.email.name,
					'to': [{
						'email': user.username,
						'name': user.username,
						'type': 'to'
					}]
				};
				sendEmail(message, callback);
			}
		});
	}
};

exports = module.exports = EmailService;

function sendEmail(message, callback) {
	var mandrillClient = new Mandrill.Mandrill(prop.config.email.mandrill_key);

	//FIX ME Remove password from log
	//logUtils.logInfo('[EmailService.sendEmail][Username: ' + message.to[0].email + '][MessageRQ: ' + JSON.stringify(message) + ']');

	mandrillClient.messages.send({
			'message': message,
			'async': false
		},
		function(data) {
			//FIX ME logUtils.logInfo('[EmailService.sendEmail][Username: ' + message.to[0].email + '][MessageRS: ' + JSON.stringify(data) + ']');
			callback();
			return;
		},
		function(err) {
			//FIX ME logUtils.logInfo('[EmailService.sendEmail][Username: ' + message.to[0].email + '][MessageRS: ' + JSON.stringify(err) + ']');
			callback(err, null);
			return;
		}
	);
}