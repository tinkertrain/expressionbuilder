/**
 * Creates a LOWER THAN clause
 * @param  {string} facet The facet
 * @param  {string} value The value
 * @return {String}       A LOWER THAN clause
 */
"use strict";

function lessThan(facet, value) {
  return facet + ":lt:\"" + value + "\"";
}

module.exports = lessThan;