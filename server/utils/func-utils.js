//=============================================================================
// UTILS METHODS TO HANDLE FUNCTIONS
//=============================================================================
'use strict';
var prop = require('app-config');
var i18n = require('i18n');
var errorUtils = require('./error-utils');
var jsonUtils = require('./json-utils');
var FuncUtils = {};

/**
 * Get correct function do handle requests based on endpoint an version informed.
 * @param method - Method used to call the endpoint.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @param next - Node next function.
 * @throws error.
 * @return function to handle request.
 */
FuncUtils.getFunc = function(method, req, res, next) {

  validateAtributes(req, method);

  var func = loadFunc(getVersion(req), getEndpoint(req));

  // Return function by version of request path
  if (!func) {
    throw prop.config.message.server.index_invalid_func;
  }

  switch (method) {
    case 'findById':
      return func.findById(req, res, next);
      break;
    case 'findAll':
      return func.findAll(req, res, next);
      break;
    case 'save':
      return func.save(req, res, next);
      break;
    case 'update':
      return func.update(req, res, next);
      break;
    case 'remove':
      return func.remove(req, res, next);
      break;
    case 'action':
      return func[getAction(req)](req, res, next);
      break;
    default:
      throw prop.config.message.server.index_method_not_implemented;
      break;
  }
};

exports = module.exports = FuncUtils;

/**
 * Load a function based on endpoint and version parameters.
 * @param version - Informed version of endpoint to load.
 * @param module loaded by parameters.
 * @throws error.
 */
function loadFunc(version, endpoint) {
  try {
    return require('../endpoints/' + version + '/' + endpoint + '-endpoint');
  } catch (e) {
    throw e;
  }
}

/**
 * Get a putAction based on request parameter.
 * @param req - HTTP Request object.
 * @throws error.
 * @return endpoint.
 */
function getAction(req) {
  var action = req.params.action;
  if (!action || action === '') {
    throw '[EndpointIndex][Error: Fail whilist preparing to load modules by requested action. Action: ' + action + ']';
  }
  return action;
}

/**
 * Get a endpoint based on request parameter.
 * @param req - HTTP Request object.
 * @param endpoint name to load.
 * @throws error.
 * @return endpoint.
 */
function getEndpoint(req) {
  var endpoint = req.params.endpoint;
  if (!endpoint || endpoint === '') {
    throw '[EndpointIndex][Error: Fail whilist preparing to load modules by requested endpoint. Endpoint: ' + endpoint + ']';
  }
  return endpoint;
}

/**
 * Get a version based on request parameter.
 * @param req - HTTP Request object.
 * @param version of endpoint to load.
 * @return version.
 */
function getVersion(req) {
  return req.params.version || prop.config.path.default_version;
}

/**
 * Validate request parameters.
 * @param req - HTTP Request object.
 * @param method - Application method.
 * @param version of endpoint to load.
 * @throws error.
 */
function validateAtributes(req, method) {
  if (!req) {
    throw prop.config.message.server.index_invalid_req;
  }

  if (!method || method === '') {
    throw prop.config.message.server.index_invalid_method;
  }
}

exports = module.exports = FuncUtils;