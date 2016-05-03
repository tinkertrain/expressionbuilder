/**
 * Creates a GREATER THAN clause
 * @param  {string} facet The facet
 * @param  {string} value The value
 * @return {String}       A GREATER THAN clause
 */
"use strict";

function greaterThan(facet, value) {
  return facet + ":gt:\"" + value + "\"";
}

module.exports = greaterThan;