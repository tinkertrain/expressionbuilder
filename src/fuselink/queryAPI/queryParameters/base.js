'use strict';

var R = require('ramda');
var utils = require('../utils');

var createQueryBase = {

  /**
   * Get the query
   * @return {object} The query object
   */
  get: function get() {
    return this.query;
  },

  /**
   * Set query.q to a passed expression
   * @param  {string} expr An expression
   * @return {object}      The internal object (for chaining purposes)
   */
  q: function q(expr) {
    if (!utils.isValidExpression(expr)) {
      throw new Error('The expression passed is invalid!');
    }
    this.query.q = expr;
    return this;
  },

  /**
   * Set query.highlight to true or false
   * @param  {boolean} highlight True or false
   * @return {object}      The internal object (for chaining purposes)
   */
  highlight: function highlight() {
    var _highlight = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    if (!R.is(Boolean, _highlight)) {
      throw new Error('Invalid parameter type passed');
    }
    this.query.highlight = _highlight;
    return this;
  },

  /**
   * Set query.limit to a passed value
   * @param  {(string|number)} val The value to set the limit to
   * @return {object}      The internal object (for chaining purposes)
   */
  limit: function limit(val) {
    this.query.limit = val.toString();

    return this;
  },

  stats: function stats(values) {
    var valid = ['global', 'refs', 'docs', 'histogram', 'frequency_dist', 'frequency_avg'];

    if (R.is(Array, values)) {
      values.forEach(function (val) {
        if (!R.contains(val, valid)) {
          throw new Error('The only valid stats values are histogram, frequency_avg, frequency_dist, refs, global and docs');
        }
      });
    } else if (R.is(String, values)) {
      if (!R.contains(values, valid)) {
        throw new Error('The only valid stats values are histogram, frequency_avg, frequency_dist, refs, global and docs');
      }
    }

    this.query.stats = this._parseParameterValues(values);
    return this;
  },

  /**
   * Encode the query object into a valid URI
   * @param  {object} q The query object
   * @return {string}   The query object in URI format
   */
  _encodeQueryToURI: function _encodeQueryToURI(q) {
    var changeFirstAmpersand = R.replace(/\&/, '?');
    var uri = R.reduce(function (accum, val) {
      var p = val[0];
      var v = val[1];
      var component = undefined;

      if (p === 'facet') {
        return '' + accum;
      }
      component = encodeURIComponent(p) + '=' + encodeURIComponent(v);

      return accum + '&' + component;
    }, '', R.toPairs(q));

    return changeFirstAmpersand(uri);
  },

  /**
   * Handle Parse parameters values passed as strings or array
   * @param  {(string|array)} param Parameters values
   * @return {string}       Parameters parsed into a valid string
   */
  _parseParameterValues: function _parseParameterValues(param) {
    var parsedParam = undefined;

    if (R.is(Array, param)) {
      parsedParam = param.join(',');
    } else if (R.is(String, param)) {
      parsedParam = param;
    } else {
      throw new Error('Invalid parameter type passed');
    }
    return parsedParam;
  },

  /**
   * Check if the sort values provided are valid, normalize the use of asc and desc
   * @param  {string} item The item to check
   * @return {string}      A valid sort item
   */
  _checkSortValues: function _checkSortValues(item) {
    var sortingValues = ['freq', 'dict', 'dict-asc', 'asc', 'desc'];
    if (!R.contains(item, sortingValues)) {
      throw new Error('Sorting value unknown');
    }
    if (item === 'asc') {
      return 'dict-asc';
    }
    if (item === 'desc') {
      return 'dict';
    }
    return item;
  },

  /**
   * Create a string from concatenating an array of object params
   * @param  {string} a Accumulator
   * @param  {string} b Item
   * @return {string}   Concatenated string
   */
  _concatObjectParams: function _concatObjectParams(a, b) {
    var props = R.keys(b);

    if (props.length === 1) {
      var joined = undefined;
      var facet = props[0];
      var value = b[facet].toString();

      joined = facet + ':' + value;

      return a + ',' + joined;
    }

    return R.reduce(function (accum, value) {
      var joinedInternal = value + ':' + b[value];
      return accum + ',' + joinedInternal;
    }, '', props);
  }
};

module.exports = createQueryBase;