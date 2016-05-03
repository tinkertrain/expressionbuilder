'use strict';

var objectAssign = require('../utils/objectAssign');
var base = require('./base');

var settings = {

  /**
   * Get all settings from a given user
   * @param  {string} userID The ID of the user
   * @return {Promise}        Response from Fuse
   */
  getAll: function getAll(userID) {
    return this._getAll('settings', userID);
  },

  /**
   * Get a specific setting from a given user
   * @param  {string} settingName    The name of the item to look for
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  get: function get(settingName, userID) {
    return this._get('settings', settingName, userID);
  },

  /**
   * Save a setting from a given user
   * @param  {Object} setting    The setting to save
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  save: function save(setting, userID) {
    return this._save('settings', setting, userID);
  },

  /**
   * Delete a specific setting from a given user
   * @param  {string} settingName    The name of the item to look for
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  remove: function remove(settingName, userID) {
    return this._remove('settings', settingName, userID);
  },

  /**
   * Delete all settings from a given user
   * @param  {string} userID The ID of the user
   * @return {Promise}        Response from Fuse
   */
  removeAll: function removeAll(userID) {
    return this._removeAll('settings', userID);
  }

};

/**
 * Factory that creates a client for the Users: Settings API
 * @param  {Object} setup Initial setup (optional)
 * @return {Object}       Settings client object
 */
function createSettingsClient() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign(settings, base));

  obj._xUserID = setup.xUserID;

  if (setup.fuseEndPoint) {
    obj._fuseEndPoint = obj._lastChar(setup.fuseEndPoint) !== '/' ? setup.fuseEndPoint + '/' : setup.fuseEndPoint;
  }

  return obj;
}

module.exports = createSettingsClient;