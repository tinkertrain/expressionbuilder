'use strict';

var R = require('ramda');

var singleFacet = {

  /**
   * Set query.value to a passed value
   * @param  {string} val The value to set the value prop to
   * @return {object}      The internal object (for chaining purposes)
   */
  value: function value(val) {
    if (!R.is(String, val)) {
      throw new Error('Invalid parameter, must be a string');
    }

    this.query.value = val;
    return this;
  },

  /**
   * Set query.facet to a passed facet
   * @param  {string} val The facet to set the facet prop to
   * @return {object}      The internal object (for chaining purposes)
   */
  facet: function facet(_facet) {
    if (!R.is(String, _facet)) {
      throw new Error('Invalid parameter, must be a string');
    }

    this.query.facet = _facet;

    return this;
  },

  /**
   * Set query.sort to a passed value
   * @param  {Array.<object>} sort Array of objects with the sorting params
   * @return {object}      The internal object (for chaining purposes)
   */
  sort: function sort(val) {
    this.query.sort = this._checkSortValues(val);

    return this;
  },

  /**
   * Get the URI from the current query object
   * @return {string} Encoded URI
   */
  getURI: function getURI() {
    return 'facets/' + this.query.facet + this._encodeQueryToURI(this.query);
  }

};

module.exports = singleFacet;