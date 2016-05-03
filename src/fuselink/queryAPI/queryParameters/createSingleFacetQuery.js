'use strict';

var objectAssign = require('../../utils/objectAssign');
var base = require('./base');
var singleFacet = require('./singleFacet');

function createSingleFacetQuery() {
  var queryObj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign(singleFacet, base));

  obj.query = queryObj;

  return obj;
}

module.exports = createSingleFacetQuery;