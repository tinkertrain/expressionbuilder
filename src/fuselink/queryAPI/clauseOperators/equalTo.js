/**
 * Creates an EQUAL TO clause
 * @param  {string} facet The facet
 * @param  {string} value The value
 * @return {String}       An EQUAL TO clause
 */
"use strict";

function equalTo(facet, value) {
  return facet + ":\"" + value + "\"";
}

module.exports = equalTo;