'use strict';

var request = require('../utils/request');
var R = require('ramda');
var objectAssign = require('../utils/objectAssign');
var base = require('./base');

var _require = require('../utils/xhr');

var handleResponse = _require.handleResponse;
var handleError = _require.handleError;

var savedSearches = {

  /**
   * Get all saved searches from a given user
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  getAll: function getAll(userID) {
    return this._getAll('savedsearches', userID);
  },

  /**
   * Get a specific saved search from a given user
   * @param  {string} searchKey    The key of the item to look for
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  get: function get(searchKey, userID) {
    return this._get('savedsearches', searchKey, userID);
  },

  /**
   * Save a saved search from a given user
   * @param  {Object} search    The search to save
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  save: function save(search, userID) {
    return this._save('savedsearches', search, userID);
  },

  /**
   * Delete a specific saved search from a given user
   * @param  {string} searchKey    The key of the item to look for
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  remove: function remove(searchKey, userID) {
    return this._remove('savedsearches', searchKey, userID);
  },

  /**
   * Delete all saved searches from a given user
   * @param  {string} userID The ID of the user
   * @return {Promise}        Response from Fuse
   */
  removeAll: function removeAll(userID) {
    return this._removeAll('savedsearches', userID);
  },

  /**
   * Update a saved search from a given user
   * @param  {Object} obj    The search to update
   * @param  {string} id The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  update: function update(search, id) {
    this._checkSetup();

    if (R.isNil(search)) {
      throw new Error('A search object was not provided');
    }

    if (R.isNil(search.key)) {
      throw new Error('A search key was not provided');
    }

    var userID = R.isNil(id) ? this._xUserID : id;

    var url = this._fuseEndPoint + 'users/' + userID + '/savedsearches/' + search.key;
    var body = JSON.stringify(R.dissoc('key', search));

    return request.patch(url).set(this._setHeaders('PATCH')).send(body).then(handleResponse)['catch'](handleError);
  }

};

/**
 * Factory that creates a client for the Users: SavedSearches API
 * @param  {Object} setup Initial setup (optional)
 * @return {Object}       SavedSearches client object
 */
function createSavedSearchesClient() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign(savedSearches, base));

  obj._xUserID = setup.xUserID;

  if (setup.fuseEndPoint) {
    obj._fuseEndPoint = obj._lastChar(setup.fuseEndPoint) !== '/' ? setup.fuseEndPoint + '/' : setup.fuseEndPoint;
  }

  return obj;
}

module.exports = createSavedSearchesClient;