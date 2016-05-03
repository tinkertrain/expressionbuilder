'use strict';

var R = require('ramda');
var utils = require('../utils');

/**
 * Takes 2 or more clauses and combines them with OR
 * but negates the second (and subsequents) one
 * (this is the default fuse behaviour).
 * @param  {...[Object, String]} facet, value, clause operator
 * @return {String}           A valid Fuse OR_NOT Expression
 */
function andNot() {
  var query = '|(';

  for (var _len = arguments.length, clauses = Array(_len), _key = 0; _key < _len; _key++) {
    clauses[_key] = arguments[_key];
  }

  var negatedClauses = utils.negateAllButFirst(clauses);
  var queryBody = R.reduce(utils.concatExpressions, '', negatedClauses);

  if (clauses.length < 2) {
    throw new Error('2 or more parameters should be passed');
  }

  query = '' + query + queryBody + ' )';

  return query.trim();
}

module.exports = andNot;