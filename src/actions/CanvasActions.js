import { ADD_EXPRESSION, SET_CLAUSE_FACET, SET_CLAUSE_VALUE, SET_CLAUSE_OPERATOR, REMOVE_EXPRESSION } from '../constants/ActionTypes';

export function addExpression(expression) {
  return {
    type: ADD_EXPRESSION,
    expression
  };
}

export function removeExpression(expression) {
  return {
    type: REMOVE_EXPRESSION,
    expression
  };
}

export function setClauseFacet(expression) {
  return {
    type: SET_CLAUSE_FACET,
    expression
  };
}

export function setClauseValue(expression) {
  return {
    type: SET_CLAUSE_VALUE,
    expression
  };
}

export function setClauseOperator(expression) {
  return {
    type: SET_CLAUSE_OPERATOR,
    expression
  };
}
