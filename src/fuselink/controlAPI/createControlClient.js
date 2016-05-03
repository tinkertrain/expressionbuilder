'use strict';

var R = require('ramda');
var request = require('../utils/request');

var _require = require('../utils/xhr');

var waitUntil = _require.waitUntil;
var handleResponse = _require.handleResponse;
var handleError = _require.handleError;

/**
 * Helper method that checks if 'ready' attribute is 'terminalStatus'
 * @param  {Object} terminalStatus
 * @param  {Object} status         Object that is being tested
 * @return {Boolean}
 */
function readyIs(terminalStatus, status) {
  return terminalStatus === status.ready ? true : false;
}

var readyIsTrue = R.partial(readyIs, true);
var readyIsFalse = R.partial(readyIs, false);

var controlAPIProto = {
  /**
  * Set Fuse End Point
  * @param {String} fuseEndPoint
  * @return {TasksAPIClient}
  */
  setFuseEndPoint: function setFuseEndPoint(endPoint) {
    var fuseEndPoint = endPoint;

    if (R.last(fuseEndPoint) !== '/') {
      fuseEndPoint = fuseEndPoint + '/';
    }
    this.fuseEndPoint = fuseEndPoint;
    this.adminPath = fuseEndPoint + 'admin/instance';
    return this;
  },
  /**
   * getStatus current Fuse instance status
   * @return {Promise} Promise that resolves to Fuse instance status
   */
  getStatus: function getStatus() {
    return request.get('' + this.adminPath).then(handleResponse)['catch'](handleError);
  },
  /**
   * Start a Fuse instance
   * @return {Promise} Resolves to status of instance after fuse starts
   */
  start: function start() {
    return request.post('' + this.adminPath).send({
      'action': 'start'
    }).then(handleResponse).then(this._waitUntilFuseStarts.bind(this))['catch'](handleError);
  },
  /**
   * Stop a given Fuse instance
   * @return {Promise} Resolves to the status of instance after it stops
   */
  stop: function stop() {
    return request.post('' + this.adminPath).send({
      'action': 'stop'
    }).then(handleResponse).then(this._waitUntilFuseStops.bind(this))['catch'](handleError);
  },
  /**
   * Restart a given Fuse instance
   * @return {Promise} Resolves to the status of instance after it restarts
   */
  restart: function restart() {
    return request.post('' + this.adminPath).send({
      'action': 'restart'
    }).then(handleResponse).then(this._waitUntilFuseStarts.bind(this))['catch'](handleError);
  },
  /**
   * Remove a given Fuse instance
   * @return {Promise}
   */
  remove: function remove() {
    return request.del('' + this.adminPath).then(handleResponse)['catch'](handleError);
  },
  /**
   * Remove all data from a given Fuse instance
   * @return {Promise}
   */
  clear: function clear() {
    return request.del(this.adminPath + '/data').then(handleResponse)['catch'](handleError);
  },
  /**
   * Retrieve current content schema
   * @return {Promise} Resolves to the current content schema
   */
  getContentSchema: function getContentSchema() {
    return request.get(this.adminPath + '/schemas/contentschema').then(handleResponse)['catch'](handleError);
  },
  /**
   * Retrieve the current index schema
   * @return {Promise} Resolves to the current index schema
   */
  getIndexSchema: function getIndexSchema() {
    return request.get(this.adminPath + '/schemas/indexschema').then(handleResponse)['catch'](handleError);
  },
  /**
   * Retrieve both content schema and index schema
   * @return {Promise} Resolves to the schemas
   */
  getSchemas: function getSchemas() {
    var self = this;
    return new Promise(function (resolve, reject) {
      Promise.all([self.getContentSchema(), self.getIndexSchema()]).then(function (schemas) {
        resolve({
          contentSchema: schemas[0],
          indexSchema: schemas[1]
        });
      })['catch'](function (error) {
        reject(error);
      });
    });
  },
  /**
   * Update the schema (only Browser)
   * @param {File} schemaFile Schema zip file
   * @return {Promise}
   */
  setSchemas: function setSchemas(schemaFile) {
    return request.put('' + this.adminPath).send(schemaFile).type('application/zip').then(handleResponse)['catch'](handleError);
  },
  /**
   * Update the schemas based on schema zip on file system (only Node JS)
   * @param {String} schemaFilePath path to schema zip file on file system
   * @return {Promise}
   */
  setSchemasFromFileSystem: function setSchemasFromFileSystem(schemaFilePath) {
    var adminPath = this.adminPath;
    return new Promise(function (resolve, reject) {
      var fs = require('fs');
      var readStream = fs.createReadStream(schemaFilePath);
      var req = request.put('' + adminPath).type('application/zip');
      readStream.pipe(req);
      readStream.on('end', function (res) {
        resolve(res);
      });
      readStream.on('error', function (err) {
        reject(err);
      });
    });
  },
  /**
   * Get current instance statistics
   * @return {Promise}
   */
  getInstanceStatistics: function getInstanceStatistics() {
    return request.get(this.adminPath + '/stats').then(handleResponse)['catch'](handleError);
  },
  /**
   * Get statistical information about contents in the instance
   * @return {Promise}
   */
  getContentStatistics: function getContentStatistics() {
    return request.get(this.adminPath + '/stats/content').then(handleResponse)['catch'](handleError);
  },
  /**
   * Get statistical information about the indexes of the current instance
   * @return {Promise}
   */
  getIndexStatistics: function getIndexStatistics() {
    return request.get(this.adminPath + '/stats/index').then(handleResponse)['catch'](handleError);
  },
  /**
   * Update the content schema
   * @param {JSON} contentSchema Valid content schema
   * @return {Promise}
   */
  setContentSchema: function setContentSchema(contentSchema) {
    return request.put(this.adminPath + '/schemas/contentschema').send(contentSchema).type('application/json').then(handleResponse)['catch'](handleError);
  },
  /**
   * Update the index schema
   * @param {JSON} indexSchema Valid index schema
   * @return {Promise}
   */
  setIndexSchema: function setIndexSchema(indexSchema) {
    return request.put(this.adminPath + '/schemas/indexschema').send(indexSchema).type('application/json').then(handleResponse)['catch'](handleError);
  },
  /**
   * Get status of a Fuse service
   * @param  {String} serviceName Name of the service
   * @return {Promise}
   */
  getServiceStatus: function getServiceStatus(serviceName) {
    return request.get(this.adminPath + '/services/' + serviceName).then(handleResponse)['catch'](handleError);
  },
  /**
   * Start a given service
   * @param  {String} serviceName Name of a service
   * @return {Promise}
   */
  startService: function startService(serviceName) {
    return request.post(this.adminPath + '/services/' + serviceName).send({
      'action': 'start'
    }).then(handleResponse).then(this._waitUntilServiceStarts.bind(this, [serviceName]))['catch'](handleError);
  },
  /**
   * Stop a given service
   * @param  {String} serviceName Name of a service
   * @return {Promise}
   */
  stopService: function stopService(serviceName) {
    return request.post(this.adminPath + '/services/' + serviceName).send({
      'action': 'stop'
    }).then(handleResponse).then(this._waitUntilServiceStops.bind(this, [serviceName]))['catch'](handleError);
  },
  /**
   * Restart a given Fuse service
   * @param  {String} serviceName Name of the service
   * @return {Promise}
   */
  restartService: function restartService(serviceName) {
    return request.post(this.adminPath + '/services/' + serviceName).send({
      'action': 'restart'
    }).then(handleResponse).then(this._waitUntilServiceStarts.bind(this, [serviceName]))['catch'](handleError);
  },
  /**
   * Get errors that have occured
   * @param  {JSON} config Configuration options
   * @return {Promise}
   */
  getErrors: function getErrors(config) {
    return request.get(this.adminPath + '/stats/errors').query(config).then(handleResponse)['catch'](handleError);
  },
  /**
   * Remove old errors
   * @param  {String} before Date as a string
   * @return {Promise}
   */
  clearErrors: function clearErrors(before) {
    var clearReq = request.del(this.adminPath + '/stats/errors');
    if (before) {
      clearReq.query({ before: before });
    }
    return clearReq.then(handleResponse)['catch'](handleError);
  },
  /**
   * Wait until service starts
   * @param  {String} serviceName Name of the service
   * @return {Promise}
   */
  _waitUntilServiceStarts: function _waitUntilServiceStarts(serviceName) {
    return waitUntil(this.getServiceStatus.bind(this, serviceName), readyIsTrue);
  },
  /**
   * Wait until service stops
   * @param  {String} serviceName Name of the service
   * @return {Promise}
   */
  _waitUntilServiceStops: function _waitUntilServiceStops(serviceName) {
    return waitUntil(this.getServiceStatus.bind(this, serviceName), readyIsFalse)['catch'](handleError);
  },
  /**
   * Wait until Fuse starts
   * @return {Promise}
   */
  _waitUntilFuseStarts: function _waitUntilFuseStarts() {
    return waitUntil(this.getStatus.bind(this), readyIsTrue);
  },
  /**
   * Wait until Fuse stops
   * @return {Promise}
   */
  _waitUntilFuseStops: function _waitUntilFuseStops() {
    return waitUntil(this.getStatus.bind(this), readyIsFalse);
  }
};

/**
 * Factory method that creates a Control API Client
 * @param  {Object} setup Control API Client setup object
 * @return {ControlAPIClient} Control API Client
 */
function createControlClient() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var fuseEndPoint = setup.fuseEndPoint;

  var client = Object.create(controlAPIProto);
  client.setFuseEndPoint(fuseEndPoint);
  return client;
}

module.exports = createControlClient;