'use strict';

var request = require('../utils/request');
var R = require('ramda');
var objectAssign = require('../utils/objectAssign');
var serialize = require('../utils/serialize');
var base = require('./base');

var _require = require('../utils/xhr');

var handleResponse = _require.handleResponse;
var handleError = _require.handleError;

var histories = {

  /**
   * Get the end points from Histories from a given user
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  getEndPoints: function getEndPoints(userID) {
    return this._getAll('histories', userID);
  },

  /**
   * Get the user searches from Histories from a given user
   * @param  {object} params An object with params to restric the search to
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  getUserSearches: function getUserSearches(params, userID) {
    return this._getEndPoint('searches', params, userID);
  },

  /**
   * Get the user views from Histories from a given user
   * @param  {object} params An object with params to restric the search to
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  getUserViews: function getUserViews(params, userID) {
    return this._getEndPoint('views', params, userID);
  },

  /**
   * Delete the user searches from a given user
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  removeUserSearches: function removeUserSearches(userID) {
    return this._removeEndPoint('searches', userID);
  },

  /**
   * Delete the user views from a given user
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  removeUserViews: function removeUserViews(userID) {
    return this._removeEndPoint('views', userID);
  },

  /**
   * Delete a specific item from a given endpoint from a given user
   * @param  {string} endpoint    The histories endpoint to make a request to
   * @param  {string} id The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  _removeEndPoint: function _removeEndPoint(endpoint, id) {
    this._checkSetup();

    var userID = R.isNil(id) ? this._xUserID : id;

    return request.del(this._fuseEndPoint + 'users/' + userID + '/histories/' + endpoint).set(this._setHeaders('DELETE')).then(handleResponse)['catch'](handleError);
  },

  /**
   * Get a items from a given endpoint from a given user
   * @param  {string} endpoint    The histories endpoint to make a request to
   * @param  {object} params An object with params to restrict the search to
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  _getEndPoint: function _getEndPoint(endpoint, params, id) {
    this._checkSetup();

    var userID = R.isNil(id) ? this._xUserID : id;

    var queryString = R.isNil(params) ? '' : '?' + serialize(params);

    return request.get(this._fuseEndPoint + 'users/' + userID + '/histories/' + endpoint + queryString).set(this._setHeaders('GET')).then(handleResponse)['catch'](handleError);
  }
};

/**
 * Factory that creates a client for the Users: Histories API
 * @param  {Object} setup Initial setup (optional)
 * @return {Object}       Histories client object
 */
function createHistoriesClient() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign(histories, base));

  obj._xUserID = setup.xUserID;

  if (setup.fuseEndPoint) {
    obj._fuseEndPoint = obj._lastChar(setup.fuseEndPoint) !== '/' ? setup.fuseEndPoint + '/' : setup.fuseEndPoint;
  }

  return obj;
}

module.exports = createHistoriesClient;