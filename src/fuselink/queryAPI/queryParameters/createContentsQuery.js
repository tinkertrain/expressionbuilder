'use strict';

var objectAssign = require('../../utils/objectAssign');
var base = require('./base');
var contents = require('./contents');

function createContentsQuery() {
  var queryObj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var obj = Object.create(objectAssign(contents, base));

  obj.query = queryObj;

  return obj;
}

module.exports = createContentsQuery;