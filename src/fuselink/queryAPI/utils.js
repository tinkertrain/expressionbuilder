'use strict';

var R = require('ramda');
var not = require('./clauseOperators/not');

/**
 * Check if a string contains an & or | operand
 * @param  {string} expression - The expression to check
 * @return {boolean} True if found, false if not
 */
function hasValidOperand(expression) {
  var and = R.indexOf('&', expression) !== -1;
  var or = R.indexOf('|', expression) !== -1;

  return R.or(and, or);
}

/**
 * Detect an expression, calls hasValid operand and is open for extension
 * @param  {string} expression The expression to check
 * @return {boolean} True if valid, false if not
 */
function detectExpression(expression) {
  return hasValidOperand(expression);
}

function isSimple(expression) {
  return R.indexOf(':', expression) !== -1 && expression.split(':').length === 2;
}

/**
 * Detect an expression and check if its valid
 * @param  {string} expression The expression to check
 * @return {boolean} True if valid, false if not
 */
function isValidExpression(expression) {
  return hasValidOperand(expression) && checkParenthesis(expression) || isSimple(expression);
}

/**
 * Check parenthesis balance and structure in a string
 * @param  {string} string The string to check
 * @return {boolean} True if valid, false if not
 */
function checkParenthesis(string) {
  /* eslint-disable no-cond-assign */
  var parentheses = '()';
  var stack = [];
  var character = undefined;
  var bracePosition = undefined;

  for (var i = 0; character = string[i]; i++) {
    bracePosition = parentheses.indexOf(character);

    if (bracePosition === -1) {
      continue;
    }

    if (bracePosition % 2 === 0) {
      stack.push(bracePosition + 1); // push next expected brace position
    } else {
        if (stack.pop() !== bracePosition) {
          return false;
        }
      }
  }

  return stack.length === 0;
}

/**
 * Create a string from concatenating an array of expressions
 * @param  {string} acc Accumulator
 * @param  {string} item Item
 * @return {string}   Concatenated string
 */
function concatExpressions(acc, item) {
  var isValidObject = R.both(R.has('facet'), R.has('value'));
  var a = acc;
  var b = item;

  if (R.is(Object, b)) {
    if (isValidObject(b)) {
      b = b.facet + ':' + b.value;
    } else {
      throw new Error();
    }
  } else if (detectExpression(b)) {
    if (checkParenthesis(b)) {
      return a + ' ' + b;
    }

    throw new Error();
  }

  if (b.indexOf(':') === -1) {
    throw new Error();
  }
  var clause = parseClause(b);

  var facet = clause.facet;
  var operator = clause.operator;
  var value = '' + clause.value;
  var joined = '';

  if (operator === 'eq') {
    joined = facet + ':' + value;
  } else {
    joined = facet + ':' + operator + ':' + value;
  }

  return a + ' ' + joined;
}

/**
 * Parse clauses
 * @param  {string} clause The clause to parse
 * @return {object} An object with props: facet, operator and value
 */
function parseClause(clause) {
  var colonsCount = countCharIn(':', clause);
  var splittedClause = clause.split(':');
  var validOperators = ['eq', 'lt', 'lte', 'gt', 'gte'];

  if (colonsCount === 2) {
    var isValidOperator = R.contains(splittedClause[1])(validOperators);

    if (!isValidOperator) {
      throw new Error('The clause contains an invalid operator, allowed only [eq, lt, lte, gt, gte]');
    }

    return {
      facet: splittedClause[0],
      operator: splittedClause[1],
      value: splittedClause[2]
    };
  } else if (colonsCount === 1) {
    return {
      facet: splittedClause[0],
      operator: 'eq',
      value: splittedClause[1]
    };
  }

  throw new Error('The clause should be in form "facet:operator:value"');
}

/**
 * Counts how many times a character appears in a string
 * @param  {string} char   The character to look for
 * @param  {string} string The string to look into
 * @return {number} The number of times the character was found in the string
 */
function countCharIn(char, string) {
  var splitted = string.split('');
  var isChar = function isChar(n) {
    return n === char;
  };
  return R.filter(isChar, splitted).length;
}

/**
 * Negates all clauses except the first
 * @param  {Array} clauses Array of clauses to process
 * @return {Array} Array of clauses
 */
function negateAllButFirst(clauses) {
  var mapIndexed = R.addIndex(R.map);

  return mapIndexed(function (el, index) {
    return index !== 0 ? not(el) : el;
  }, clauses);
}

module.exports = {
  detectExpression: detectExpression,
  checkParenthesis: checkParenthesis,
  concatExpressions: concatExpressions,
  countCharIn: countCharIn,
  parseClause: parseClause,
  negateAllButFirst: negateAllButFirst,
  isValidExpression: isValidExpression
};