'use strict';

var R = require('ramda');
var request = require('../utils/request');
var createTasksObject = require('./createTasksObject');

var _require = require('../utils/xhr');

var handleResponse = _require.handleResponse;
var handleError = _require.handleError;

/**
 * Creates a taskObject from HTTP Response. The header of the response
 * must contain Location of the task
 * @param {HttpResponse} httpResponse superagent
 * @return {Promise} Promise that resolves to a taskObject
 */
function taskFromResponse(httpResponse) {
  return Promise.resolve(createTasksObject({
    taskUrl: httpResponse.headers.location
  }));
}

var tasksAPIClientProto = {
  /**
  * Set Fuse End Point
  * @param {String} endpoint
  * @return {TasksAPIClient}
  */
  setFuseEndPoint: function setFuseEndPoint(endpoint) {
    var fuseEndPoint = endpoint;

    if (R.last(fuseEndPoint) !== '/') {
      fuseEndPoint = fuseEndPoint + '/';
    }
    this.fuseEndPoint = fuseEndPoint;
    this.tasksPath = fuseEndPoint + 'tasks';
    return this;
  },
  /**
   * Upload contents to Fuse
   * @param  {List} payload    Payload of contents uploaded to Fuse
   * @return {Promise}         Resolves to Task Object
   */
  update: function update(payload) {
    var payloadFormatted = payload;
    if (R.isArrayLike(payload)) {
      payloadFormatted = {
        items: payload.map(function (item) {
          return item.get();
        })
      };
    }
    return request.post(this.tasksPath + '/types/update').type('application/json').send(payloadFormatted).then(taskFromResponse)['catch'](handleError);
  },
  /*
   * Alias to TasksAPIClient.update. Upload contents to Fuse
   *
   * @param  {List} payload    Payload of contents uploaded to Fuse
   * @return {Promise}         Resolves to Task Object
   */
  upload: function upload(payload) {
    return this.update(payload);
  },
  /**
   * Trigger a full index of Fuse contents
   * @return {Promise} Resolves to TaskObject
   */
  index: function index() {
    return request.post(this.tasksPath + '/types/index').type('application/json').send('').then(taskFromResponse)['catch'](handleError);
  },
  /**
   * Remove contents from Fuse based on a query
   * @param  {String} query Fuse query string
   * @return {Promise}       Resolves to TaskObject
   */
  remove: function remove(query) {
    return request.del(this.tasksPath + '/types/delete').query({ q: query }).then(taskFromResponse)['catch'](handleError);
  },
  /**
   * Remove a given completed task
   * @param  {TaskObject} task Task Object have a attribute 'location'
   * @return {Promise}
   */
  removeCompletedTask: function removeCompletedTask(task) {
    return request.del('' + task.taskUrl).then(handleResponse, handleError);
  },
  /**
   * remove completed tasks before a certain date
   * @param  {String} before Date as a string
   * @return {Promise}
   */
  removeCompletedTasks: function removeCompletedTasks(before) {
    var delRequest = request.del(this.tasksPath + '/stats');
    if (before) {
      delRequest.send({ before: before });
    }
    return delRequest.then(handleResponse, handleError);
  },
  /**
   * Get tasks status
   * @param  {JSON} args={} Query parameters
   * @return {Promise}
   */
  getTasksStatus: function getTasksStatus() {
    var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return request.get(this.tasksPath + '/stats').query(args).then(handleResponse, handleError);
  }
};

/**
 * Factory that creates a Tasks API client
 * @param {Object} setup Setup Params for the Tasks Client
 * @return {TasksClient}
 */
function createTasksClient() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var fuseEndPoint = setup.fuseEndPoint;

  var tasksClient = Object.create(tasksAPIClientProto);
  tasksClient.setFuseEndPoint(fuseEndPoint);
  return tasksClient;
}

module.exports = createTasksClient;