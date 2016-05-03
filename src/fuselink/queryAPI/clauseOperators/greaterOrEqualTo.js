/**
 * Creates a GREATER OR EQUAL TO clause
 * @param  {string} facet The facet
 * @param  {string} value The value
 * @return {String}       A GREATER OR EQUAL TO clause
 */
"use strict";

function greaterOrEqualTo(facet, value) {
  return facet + ":gte:\"" + value + "\"";
}

module.exports = greaterOrEqualTo;