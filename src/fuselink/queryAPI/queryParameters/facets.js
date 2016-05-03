'use strict';

var R = require('ramda');

var facets = {

  /**
   * Set query.values to a passed array of values
   * @param  {(string|Array)} attrs values
   * @return {object}      The internal object (for chaining purposes)
   */
  value: function value(values) {
    this.query.value = this._parseParameterValues(values);
    return this;
  },

  /**
   * Set query.facets to a passed array of facets
   * @param  {(string|Array)} attrs facets
   * @return {object}      The internal object (for chaining purposes)
   */
  facets: function facets(values) {
    this.query.facets = this._parseParameterValues(values);
    return this;
  },

  /**
   * Set query.fSort to a passed value
   * @param  {Array.<object>} sort Array of objects with the sorting params
   * @return {object}      The internal object (for chaining purposes)
   */
  facetSort: function facetSort() {
    for (var _len = arguments.length, sort = Array(_len), _key = 0; _key < _len; _key++) {
      sort[_key] = arguments[_key];
    }

    if (!R.all(R.is(Object), sort)) {
      throw new Error('Invalid parameter type passed');
    }

    var sortChecked = R.map(R.mapObj(this._checkSortValues), R.flatten(sort));

    var removeFirstComma = R.replace(/\,/, '');
    var parsedSort = removeFirstComma(R.reduce(this._concatObjectParams, '', sortChecked));

    this.query.facet_sort = parsedSort;
    return this;
  },

  /**
   * Set query.fLimit to a passed value
   * @param  {Array.<object>} limit Array of objects with the limit params
   * @return {object}      The internal object (for chaining purposes)
   */
  facetLimit: function facetLimit() {
    for (var _len2 = arguments.length, limit = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      limit[_key2] = arguments[_key2];
    }

    if (!R.all(R.is(Object), limit)) {
      throw new Error('Invalid parameter type passed');
    }

    var removeFirstComma = R.replace(/\,/, '');
    var parsedLimit = removeFirstComma(R.reduce(this._concatObjectParams, '', R.flatten(limit)));

    this.query.facet_limit = parsedLimit;

    return this;
  },

  withStats: function withStats(values) {
    this.query.with_stats = this._parseParameterValues(values);
    return this;
  },

  /**
   * Get the URI from the current query object
   * @return {string} Encoded URI
   */
  getURI: function getURI() {
    return 'facets' + this._encodeQueryToURI(this.query);
  }
};

module.exports = facets;