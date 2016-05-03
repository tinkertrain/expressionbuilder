'use strict';

var request = require('../utils/request');
var R = require('ramda');

var _require = require('../utils/xhr');

var waitUntil = _require.waitUntil;
var handleResponse = _require.handleResponse;
var handleError = _require.handleError;

var tasksObjectProto = {
  /**
   * Set Task Url
   * @param {String} taskUrl Task Url
   * @return {TaskObject}
   */
  setTaskUrl: function setTaskUrl(taskUrl) {
    if (typeof taskUrl !== 'undefined') {
      this.taskUrl = taskUrl;
      this.location = taskUrl;
      delete this.fuseEndPoint;
      delete this.taskId;
    }
    return this;
  },
  /**
   * Returns the current task url
   * @param  {TaskObject} taskObject
   * @throws {Error} Throws error if Task Object is not setup
   * @return {String}            Task URL
   */
  getTaskUrl: function getTaskUrl(taskObject) {
    var taskObj = taskObject || this;
    var taskUrl = taskObj.taskUrl;
    var fuseEndPoint = taskObj.fuseEndPoint;
    var taskId = taskObj.taskId;

    var location = undefined;

    if (typeof taskUrl !== 'undefined') {
      location = taskUrl;
    } else if (typeof fuseEndPoint !== 'undefined' && typeof taskId !== 'undefined') {
      if (R.last(fuseEndPoint) !== '/') {
        fuseEndPoint = fuseEndPoint + '/';
      }

      location = fuseEndPoint + 'tasks/stats/' + taskId;
    } else {
      throw new Error('Required "taskId" or "taskUrl" is not defined.');
    }

    return location;
  },
  /**
   * Set the current Fuse Endpoint
   * @param {String} fuseEndPoint Fuse API Endpoint
   * @return {TaskObject}
   */
  setFuseEndpoint: function setFuseEndpoint(fuseEndPoint) {
    if (typeof fuseEndPoint !== 'undefined') {
      this.fuseEndPoint = fuseEndPoint;
      delete this.taskUrl;
      delete this.location;
    }
    return this;
  },
  /**
   * Set the current Task ID
   * @param {String} taskId Task ID
   * @return {TaskObject}
   */
  setTaskId: function setTaskId(taskId) {
    if (typeof taskId !== 'undefined') {
      this.taskId = taskId.toString();
      delete this.taskUrl;
      delete this.location;
    }
    return this;
  },
  /**
   * Get the current status of the task
   * @throws {Error} If Task Object is not setup
   * @return {Promise}
   */
  getStatus: function getStatus() {
    var location = this.getTaskUrl();
    return request.get(location).then(handleResponse, handleError);
  },
  /**
   * Waits before resolving a promise until the task is completed.
   * @return {Promise} Promise that resolves when Task is completed
   */
  waitUntilDone: function waitUntilDone() {
    return waitUntil(this.getStatus.bind(this), readyWhenDone, 10000);
  }
};

function readyWhenDone(taskStatus) {
  return taskStatus.done;
}

/**
 * Factory that creates a Tasks Object
 * @param  {Object} setup Setup Parameter
 * @return {TasksObject}  Tasks Object
 */
function createTasksObject() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var tasksObject = Object.create(tasksObjectProto);
  tasksObject.setFuseEndpoint(setup.fuseEndPoint).setTaskId(setup.taskId).setTaskUrl(setup.taskUrl);
  return tasksObject;
}

module.exports = createTasksObject;