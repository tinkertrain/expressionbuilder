'use strict';

var _require = require('../utils/xhr');

var waitUntil = _require.waitUntil;
var handleResponse = _require.handleResponse;
var handleError = _require.handleError;

var request = require('../utils/request');
var R = require('ramda');

/**
 * Helper method to check if 'status' field is a given value
 * @param  {Object} serviceStatus ServiceStatus response from services API
 * @param  {String} statusValue   Expected status value
 * @return {Boolen}               [description]
 */
function statusIs(terminalStatusValue, serviceStatus) {
  return serviceStatus.status === terminalStatusValue ? true : false;
}

var statusIsActive = R.partial(statusIs, 'active');
var statusIsStopped = R.partial(statusIs, 'stopped');

var servicesAPIProto = {
  /**
   * Get all created services
   * @param  {Integer} limit  Limit the number of services returned
   * @param  {Integer} offset Offset of the services returned.
   * @return {Promise}        Promise that resolves to all created services
   */
  getAllServices: function getAllServices() {
    var limit = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];
    var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    return request.get('' + this.servicesEndPoint).query({
      limit: limit,
      offset: offset
    }).then(handleResponse)['catch'](handleError);
  },

  /**
   * Get individual service
   * @param  {String} serviceId Service Id
   * @return {Promise}          Promise that resolves with service status
   */
  getService: function getService(serviceId) {
    return request.get(this.servicesEndPoint + '/' + serviceId).then(handleResponse)['catch'](handleError);
  },

  /**
   * Disable a service
   * @param  {String} serviceId Service Id
   * @return {Promise}
   */
  disableService: function disableService(serviceId) {
    return request.post(this.servicesEndPoint + '/' + serviceId + '/disable').type('application/json').then(handleResponse).then(this._waitUntilServiceDisables.bind(this, serviceId))['catch'](handleError);
  },

  /**
   * Enable a service
   * @param  {String} serviceId Service Id
   * @return {Promise}
   */
  enableService: function enableService(serviceId) {
    return request.post(this.servicesEndPoint + '/' + serviceId + '/enable').type('application/json').then(handleResponse).then(this._waitUntilServiceEnables.bind(this, serviceId))['catch'](handleError);
  },

  /**
   * Resolves a promise when service is enabled
   * @param  {String} serviceId
   * @return {Promise}
   */
  _waitUntilServiceEnables: function _waitUntilServiceEnables(serviceId) {
    return waitUntil(this.getService.bind(this, serviceId), statusIsActive);
  },

  /**
   * Resolves a promise when service is disabled
   */
  _waitUntilServiceDisables: function _waitUntilServiceDisables(serviceId) {
    return waitUntil(this.getService.bind(this, serviceId), statusIsStopped);
  }
};

/**
 * Factory method that creates a Services API Client
 * @param  {Object} Config object with Fuse Endpoint
 * @return {ServicesClient} Services API Client
 */
function createServicesClient() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var fuseEndPoint = setup.fuseEndPoint;

  var client = Object.create(servicesAPIProto);
  client.fuseEndPoint = fuseEndPoint;
  client.servicesEndPoint = fuseEndPoint + '/services';
  return client;
}

module.exports = createServicesClient;