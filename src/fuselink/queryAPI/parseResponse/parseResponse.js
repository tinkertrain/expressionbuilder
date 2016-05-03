'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R = require('ramda');

/**
 * Obtain an object with facet name as props and it's items as values
 * @param  {(string|Array.<string>)} facets - Facet name, or an array of facet names
 * @return {function} Function that accepts fuse data items
 */
function getFacetsWithItems(facets) {
  var facetsPassed = R.is(Array, facets) ? facets : [facets];
  var filterData = R.filter(function (i) {
    return R.contains(i.name, facetsPassed);
  });
  var pickProps = _pickPropsWith(['items', 'name']);
  var groupByName = _toObject('name', 'items');

  return R.compose(groupByName, pickProps, filterData);
}

/**
 * Obtain an object with facet name as props and it's label as value
 * @param  {(string|Array.<string>)} facets - Facet name, or an array of facet names
 * @return {function} Function that accepts fuse data items
 */
function getFacetsWithLabels(facets) {
  var facetsPassed = R.is(Array, facets) ? facets : [facets];
  var filterData = R.filter(function (i) {
    return R.contains(i.name, facetsPassed);
  });
  var pickProps = _pickPropsWith(['label', 'name']);
  var groupByName = _toObject('name', 'label');

  return R.compose(groupByName, pickProps, filterData);
}

/**
 * Obtain an object with facet value as prop and it's frequency as value
 * @param  {(number)} limit - The amount of results returned
 * @return {function} Function that accepts fuse data items
 */
function getValuesWithFreq(limit) {
  var pickValueAndFreq = _pickPropsWith(['value', 'freq']);
  var groupByValue = _toObject('value', 'freq');

  return limit ? R.compose(groupByValue, R.take(limit), pickValueAndFreq) : R.compose(groupByValue, pickValueAndFreq);
}

/**
 * Obtain an object with facet value as props and it's Fuse Queries as values
 * @param  {(string|Array.<string>)} q - A query or an array of queries to return
 * @return {function} Function that accepts fuse data items
 */
function getValuesWithQueries(q) {
  var allQueries = ['and_not_query', 'and_query', 'or_not_query', 'or_query'];
  var passedQueries = R.is(Array, q) ? q : [q];
  var normalizedQueries = R.map(_normalizeQuery, passedQueries);
  var chosenQueries = R.intersection(allQueries, normalizedQueries).length > 0 ? R.intersection(allQueries, normalizedQueries) : allQueries;
  var pickValueAndQueries = _pickPropsWith(chosenQueries.concat('value'));
  var toObject = R.compose(R.mapObj(function (el) {
    return R.dissoc('value', el[0]);
  }), R.groupBy(function (el) {
    return el.value;
  }));

  return R.compose(toObject, pickValueAndQueries);
}

/**
 * Obtain an array of objects of attributes and their rendered values
 * @param  {(string|Array.<string>)} attrs - An attribute or an array of attributes
 * @return {function} Function that accepts fuse data items
 */
function getRenderedValues(attrs) {
  var attrsPassed = R.is(Array, attrs) ? attrs : [attrs];

  return attrs ? R.compose(R.map(function (el) {
    return R.mapObj(function (o) {
      return o.rendered_value;
    }, R.pick(attrsPassed, el));
  }), R.pluck('attribute_infos')) : R.compose(R.map(function (el) {
    return R.mapObj(function (o) {
      return o.rendered_value;
    }, el);
  }), R.pluck('attribute_infos'));
}

/**
 * Obtain an array of object attributes and highlight their values w/supplied tags
 * @param {Object} params - Configuration object
 * @param {string} params.attr - The attribute to highlight (required)
 * @param {string} [params.start=<strong>] - The opening wrapping value
 * @param {string} [params.end=</strong>] - The closing wrapping value
 * @return {function} Function that accepts fuse data items
 */
function wrapForHighlight(params) {
  if (!params) {
    throw new Error('No attribute to highlight passed');
  }
  if (!params.attr) {
    throw new Error('No attribute to highlight passed');
  }
  if (!params.start) {
    params.start = '<strong>';
  }
  if (!params.end) {
    params.end = '</strong>';
  }

  return R.compose(R.map(function (item) {
    var replaced = item.rendered_value;

    R.forEach(function (i) {
      var findSubstr = R.slice(i[0], i[1], item.rendered_value);
      var wrap = '' + params.start + findSubstr + params.end;
      replaced = replaced.replace(findSubstr, wrap);
    }, item.highlights);

    return _defineProperty({}, params.attr, replaced);
  }), R.map(function (o) {
    return o[params.attr];
  }), R.pluck('attribute_infos'));
}

/**
 * Obtain an array of objects of attributes, detect Urls and wrap them in <a> tags
 * @param  {(string|Array.<string>)} attrs - An attribute or an array of attributes
 * @return {function} Function that accepts fuse data items
 */
function linkify(attrs) {
  var attrsPassed = R.is(Array, attrs) ? attrs : [attrs];

  return attrs ? R.compose(R.map(function (e) {
    return R.mapObj(function (o) {
      return _replaceURLWithHTMLLinks(o);
    }, e);
  }), _pickPropsWith(attrsPassed), getRenderedValues(attrsPassed)) : R.compose(R.map(function (e) {
    return R.mapObj(function (o) {
      return _replaceURLWithHTMLLinks(o);
    }, e);
  }), getRenderedValues());
}

/**
 * Convert "and, or, and_not, or_not" to the form "_query"
 * @param  {string} q - Query passed
 * @return {string} Query transformed
 */
function _normalizeQuery(q) {
  var queries = {
    'and': 'and_query',
    'and_not': 'and_not_query',
    'or': 'or_query',
    'or_not': 'or_not_query'
  };

  return queries[q];
}

/**
 * Detect URLS in strings and wrap them in html <a> tags
 * @param  {string} text - Some text
 * @return {string} Text with URL wrapped in <a> tags if found
 */
function _replaceURLWithHTMLLinks(text) {
  /* eslint-disable max-len */
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  /* eslint-enable max-len */
  return text.replace(exp, '<a href="$1">$1</a>');
}

/**
 * Parse an array of objects and return the objects with only the props supplied
 * @param  {Array} props - Props to pick
 * @return {function} Function that takes data as array
 */
function _pickPropsWith(props) {
  return R.map(R.pick(props));
}

/**
 * Converts to an object grouped by a value supplied
 * @param  {string} groupBy - The prop to group by
 * @param  {string} prop - The prop selected for the value
 * @return {function} Function that takes data as array
 */
function _toObject(groupBy, prop) {
  return R.compose(R.mapObj(function (el) {
    return el[0][prop];
  }), R.groupBy(function (el) {
    return el[groupBy];
  }));
}

module.exports = {
  getFacetsWithItems: getFacetsWithItems,
  getValuesWithFreq: getValuesWithFreq,
  getValuesWithQueries: getValuesWithQueries,
  getFacetsWithLabels: getFacetsWithLabels,
  getRenderedValues: getRenderedValues,
  wrapForHighlight: wrapForHighlight,
  linkify: linkify
};