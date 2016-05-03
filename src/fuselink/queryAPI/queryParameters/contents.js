'use strict';

var R = require('ramda');

var contents = {

  /**
   * Set query.offset to a passed value
   * @param  {(string|number)} val The value to set the offset to
   * @return {object}      The internal object (for chaining purposes)
   */
  offset: function offset(val) {
    this.query.offset = val.toString();

    return this;
  },

  /**
   * Set query.sortby to a passed value
   * @param  {Array.<object>} sort Array of objects with the sorting params
   * @return {object}      The internal object (for chaining purposes)
   */
  sortBy: function sortBy() {
    for (var _len = arguments.length, sort = Array(_len), _key = 0; _key < _len; _key++) {
      sort[_key] = arguments[_key];
    }

    if (!R.all(R.is(Object), sort)) {
      throw new Error('Invalid parameter type passed');
    }

    var sortChecked = R.map(R.mapObj(this._checkSortValuesForContents), sort);

    var removeFirstComma = R.replace(/\,/, '');
    var parsedSort = removeFirstComma(R.reduce(this._concatObjectParams, '', sortChecked));

    this.query.sortby = parsedSort;
    return this;
  },

  /**
   * Set query.attributes to a passed array of attributes
   * @param  {(string|Array)} attrs Attributes
   * @return {object}      The internal object (for chaining purposes)
   */
  attributes: function attributes(attrs) {
    this.query.attributes = this._parseParameterValues(attrs);

    return this;
  },

  /**
   * Set query.width to a passed value for backwards compatibility
   * @param  {(string|number)} val The value to set the width to
   * @return {object}      The internal object (for chaining purposes)
   */
  cut: function cut(val) {
    this.query.width = val.toString();

    return this;
  },

  /**
   * Set query.width to a passed value
   * @param  {(string|number)} val The value to set the width to
   * @return {object}      The internal object (for chaining purposes)
   */
  width: function width(val) {
    this.query.width = val.toString();

    return this;
  },

  /**
   * Get the URI from the current query object
   * @return {string} Encoded URI
   */
  getURI: function getURI() {
    return 'contents' + this._encodeQueryToURI(this.query);
  },

  /**
   * Check if the sort values provided are valid
   * @param  {string} item The item to check
   * @return {string}      A valid sort item
   */
  _checkSortValuesForContents: function _checkSortValuesForContents(item) {
    var sortingValues = ['asc', 'desc'];
    if (!R.contains(item, sortingValues)) {
      throw new Error('Sorting value unknown');
    }
    return item;
  }
};

module.exports = contents;