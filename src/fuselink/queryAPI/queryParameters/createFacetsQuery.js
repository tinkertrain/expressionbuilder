'use strict';

var objectAssign = require('../../utils/objectAssign');
var base = require('./base');
var facets = require('./facets');

function createFacetsQuery() {
  var queryObj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign(facets, base));

  obj.query = queryObj;

  return obj;
}

module.exports = createFacetsQuery;