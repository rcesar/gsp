//=============================================================================
// APPLICATION CONFIGURATION FOR QA ENVIRONMENT
//=============================================================================
module.exports = {
	port: 8080,
	title: 'Glowing Backend',
	auth: {
		jwt_token_secret: '2gpzMVK5I9h2gNDB4dFup7AW5nrhH@sHA12PeP32nb2',
		daysOfTokenValidate: 7
	}
}