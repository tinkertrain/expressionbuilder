/**
 * Negates a caluse
 * @param  {string} clause The clause to negate
 * @return {string}        Negated clause
 */
"use strict";

function not(clause) {
  return "!" + clause;
}

module.exports = not;