import R from 'ramda';

import { ADD_EXPRESSION, SET_CLAUSE_FACET, SET_CLAUSE_VALUE, SET_CLAUSE_OPERATOR, REMOVE_EXPRESSION } from '../constants/ActionTypes';

export default function canvas(state = [], action) {
  switch (action.type) {
    case ADD_EXPRESSION:
      if (state.length !== 0) {
        let parentIndex = R.findIndex(R.propEq('id', action.expression.parent), state);
        state[parentIndex][action.expression.side] = action.expression.id;
      }
      return state.concat(action.expression);

    case REMOVE_EXPRESSION:
      let parentIndex = R.findIndex(R.propEq('id', action.expression.parent), state);

      if (parentIndex > -1) {
        let children = R.reduce(function findWithParent(accum, exp) {
          for (let i = 0; i < accum.length; i++) {
            if (exp.parent === accum[i]) {
              return accum.concat(exp.id);
            }
          }

          return accum;
        }, [action.expression.id], state);

        state[parentIndex][action.expression.side] = null;

        return R.reject((exp) => R.contains(exp.id, children), state);
      }

      return [];

    case SET_CLAUSE_FACET:
      return R.map(function setFacetValueInExp(exp) {
        if (exp.id === action.expression.id) {
          exp.facet = action.expression.facet;
        }
        return exp;
      }, state);

    case SET_CLAUSE_VALUE:
      return R.map(function setFacetValueInExp(exp) {
        if (exp.id === action.expression.id) {
          exp.value = action.expression.value;
        }
        return exp;
      }, state);

    case SET_CLAUSE_OPERATOR:
      return R.map(function setFacetValueInExp(exp) {
        if (exp.id === action.expression.id) {
          exp.clauseOperator = action.expression.clauseOperator;
        }
        return exp;
      }, state);

    default:
      return state;
  }
}
