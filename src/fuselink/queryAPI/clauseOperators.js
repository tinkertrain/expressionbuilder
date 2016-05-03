'use strict';

module.exports = {
  equalTo: require('./clauseOperators/equalTo'),
  greaterThan: require('./clauseOperators/greaterThan'),
  greaterOrEqualTo: require('./clauseOperators/greaterOrEqualTo'),
  lessThan: require('./clauseOperators/lessThan'),
  lessOrEqualTo: require('./clauseOperators/lessOrEqualTo'),
  not: require('./clauseOperators/not')
};