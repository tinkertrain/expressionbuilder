'use strict';

var R = require('ramda');
var utils = require('../utils');

/**
 * Takes 2 or more clauses and combines them with AND
 * @param  {...[Object, String]} facet, value, clause operator
 * @return {String}           A valid Fuse AND Expression
 */
function and() {
  var query = '&(';

  for (var _len = arguments.length, clauses = Array(_len), _key = 0; _key < _len; _key++) {
    clauses[_key] = arguments[_key];
  }

  var queryBody = R.reduce(utils.concatExpressions, '', clauses);

  if (clauses.length < 2) {
    throw new Error('2 or more parameters should be passed');
  }

  query = '' + query + queryBody + ' )';

  return query.trim();
}

module.exports = and;