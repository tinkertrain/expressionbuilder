'use strict';

var request = require('../utils/request');
var R = require('ramda');

var _require = require('../utils/xhr');

var handleResponse = _require.handleResponse;
var handleError = _require.handleError;

var base = {

  /**
   * Set the internal prop _xUserID
   * @param {string} xUserID The user ID
   */
  setXUserID: function setXUserID(xUserID) {
    this._xUserID = xUserID;
    return this;
  },

  /**
   * Get the current X user ID
   * @return {string} the current X user ID
   */
  getXUserID: function getXUserID() {
    return this._xUserID;
  },

  /**
   * Set the internal prop _fuseEndPoint
   * @param {string} fuseEndPoint The fuseEndPoint
   */
  setFuseEndPoint: function setFuseEndPoint(fuseEndPoint) {
    if (fuseEndPoint) {
      this._fuseEndPoint = this._lastChar(fuseEndPoint) !== '/' ? fuseEndPoint + '/' : fuseEndPoint;

      return this;
    }
  },

  /**
   * Get the current fuseEndPoint
   * @return {string} the current fuseEndPoint
   */
  getFuseEndPoint: function getFuseEndPoint() {
    return this._fuseEndPoint;
  },

  /**
   * Get all from a given api from a given user
   * @param  {string} api    The User API to make a request to
   * @param  {string} id The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  _getAll: function _getAll(api, id) {
    this._checkSetup();

    var userID = R.isNil(id) ? this._xUserID : id;

    var url = api ? this._fuseEndPoint + 'users/' + userID + '/' + api : this._fuseEndPoint + 'users';

    return request.get(url).set(this._setHeaders('GET')).then(handleResponse)['catch'](handleError);
  },

  /**
   * Get a specific item from a given api from a given user
   * @param  {string} api    The User API to make a request to
   * @param  {string} key    The key or name of the item to look for
   * @param  {string} id The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  _get: function _get(api, key, id) {
    this._checkSetup();

    if ((api === 'savedsearches' || api === 'settings') && R.isNil(key)) {
      throw new Error('A key or name was not provided');
    }

    var userID = R.isNil(id) ? this._xUserID : id;

    var url = api === 'users' ? this._fuseEndPoint + 'users/' + userID : this._fuseEndPoint + 'users/' + userID + '/' + api + '/' + key;

    return request.get(url).set(this._setHeaders('GET')).then(handleResponse)['catch'](handleError);
  },

  /**
   * Delete a specific item from a given api from a given user
   * @param  {string} api    The User API to make a request to
   * @param  {string} key    The key or name of the item to look for
   * @param  {string} id The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  _remove: function _remove(api, key, id) {
    this._checkSetup();

    if (R.isNil(key)) {
      throw new Error('A key or name was not provided');
    }

    var userID = R.isNil(id) ? this._xUserID : id;

    var url = this._fuseEndPoint + 'users/' + userID + '/' + api + '/' + key;

    return request.del(url).set(this._setHeaders('DELETE')).then(handleResponse)['catch'](handleError);
  },

  /**
   * Delete all from a given api from a given user
   * @param  {string} api    The User API to make a request to
   * @param  {string} id The ID of the user
   * @return {Promise}        Response from Fuse
   */
  _removeAll: function _removeAll(api, id) {
    this._checkSetup();

    var userID = R.isNil(id) ? this._xUserID : id;

    var url = this._fuseEndPoint + 'users/' + userID + '/' + api;

    return request.del(url).set(this._setHeaders('DELETE')).then(handleResponse)['catch'](handleError);
  },

  /**
   * Save an item from a given api from a given user
   * @param  {string} api    The User API to make a request to
   * @param  {Object} obj    The object to save
   * @param  {string} id The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  _save: function _save(api, obj, id) {
    this._checkSetup();

    if (R.isNil(obj)) {
      throw new Error('Configuration object was not provided');
    }

    if (api === 'settings' && R.isNil(obj.name)) {
      throw new Error('A setting name was not provided');
    }

    if (api === 'savedsearches') {
      if (R.isNil(obj.query)) {
        throw new Error('query is missing');
      }
      if (R.isNil(obj.query.expression)) {
        throw new Error('query.expression is required');
      }
    }

    var userID = R.isNil(id) ? this._xUserID : id;

    var url = api === 'settings' ? this._fuseEndPoint + 'users/' + userID + '/' + api + '/' + obj.name : this._fuseEndPoint + 'users/' + userID + '/' + api;

    var method = api === 'settings' ? 'PUT' : 'POST';

    var body = api === 'settings' ? JSON.stringify(R.dissoc('name', obj)) : JSON.stringify(obj);

    return request(method, url).set(this._setHeaders(method)).send(body).then(handleResponse)['catch'](handleError);
  },

  /**
   * Get the correct headers for a given method
   * @param {string} method The REST method to set the headers to
   * @return {Object}       Headers object
   */
  _setHeaders: function _setHeaders(method) {
    var headers = {
      'X-User-Id': this._xUserID
    };

    if (method !== 'GET') {
      headers.Accept = 'application/json';
      headers['Content-Type'] = method === 'PATCH' ? 'application/json-merge-patch' : 'application/json';
    }
    return headers;
  },

  /**
   * Get the last character from s tring
   * @param  {string} string The string to process
   * @return {string}        The last character from the string given
   */
  _lastChar: function _lastChar(string) {
    return R.nthChar(string.length - 1, string);
  },

  /**
   * Check if the _xUserID and the _fuseEndPoint props have been set
   */
  _checkSetup: function _checkSetup() {
    if (R.isNil(this._xUserID)) {
      throw new Error('User ID has not been set');
    }

    if (R.isNil(this._fuseEndPoint)) {
      throw new Error('Fuse EndPoint (Fuse url) has not been set');
    }
  }
};

module.exports = base;