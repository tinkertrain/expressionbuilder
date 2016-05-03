'use strict';

var objectAssign = require('../utils/objectAssign');
var base = require('./base');

var users = {
  /**
   * Get all users
   * @return {Promise}        Response from Fuse
   */
  getAll: function getAll() {
    return this._getAll();
  },

  /**
   * Get a specific user
   * @param  {string} userID The ID of the user to get stuff from
   * @return {Promise}        Response from Fuse
   */
  get: function get(userID) {
    return this._get('users', null, userID);
  }
};

/**
 * Factory that creates a client for the Users API
 * @param  {Object} setup Initial setup (optional)
 * @return {Object}       Users Summary client object
 */
function createSummaryClient() {
  var setup = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign(users, base));

  obj._xUserID = setup.xUserID;

  if (setup.fuseEndPoint) {
    obj._fuseEndPoint = obj._lastChar(setup.fuseEndPoint) !== '/' ? setup.fuseEndPoint + '/' : setup.fuseEndPoint;
  }

  return obj;
}

module.exports = createSummaryClient;