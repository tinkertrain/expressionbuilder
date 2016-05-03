/**
 * Creates a LOWER OR EQUAL TO clause
 * @param  {string} facet The facet
 * @param  {string} value The value
 * @return {String}       A LOWER OR EQUAL TO clause
 */
"use strict";

function lessOrEqualTo(facet, value) {
  return facet + ":lte:\"" + value + "\"";
}

module.exports = lessOrEqualTo;