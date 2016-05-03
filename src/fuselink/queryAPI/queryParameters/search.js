"use strict";

var search = {
  /**
   * Get the URI from the current query object
   * @return {string} Encoded URI
   */
  getURI: function getURI() {
    return "search" + this._encodeQueryToURI(this.query);
  }
};

module.exports = search;