'use strict';

var objectAssign = require('../../utils/objectAssign');
var base = require('./base');
var contents = require('./contents');
var facets = require('./facets');
var search = require('./search');

function createSearchQuery() {
  var queryObj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign({}, base, facets, contents, search));

  obj.query = queryObj;

  return obj;
}

module.exports = createSearchQuery;