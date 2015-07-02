import R from 'ramda';

import { ADD_EXPRESSION, SET_CLAUSE_FACET, SET_CLAUSE_VALUE, SET_CLAUSE_OPERATOR, REMOVE_EXPRESSION } from '../constants/ActionTypes';

let initialState = [];
// let initialState = [
//  {
//   "type": "expression",
//   "operator": "and",
//   "parent": null,
//   "left": 1,
//   "right": 2,
//   "side": null,
//   "id": 0
//  },
//  {
//   "type": "expression",
//   "operator": "or",
//   "parent": 0,
//   "left": 7,
//   "right": 4,
//   "side": "left",
//   "id": 1
//  },
//  {
//   "type": "expression",
//   "operator": "or",
//   "parent": 0,
//   "left": 5,
//   "right": 6,
//   "side": "right",
//   "id": 2
//  },
//  {
//   "type": "clause",
//   "facet": "name",
//   "value": "paul",
//   "clauseOperator": "equalTo",
//   "parent": 1,
//   "side": "right",
//   "id": 4
//  },
//  {
//   "type": "clause",
//   "facet": "location",
//   "value": "usa",
//   "clauseOperator": "equalTo",
//   "parent": 2,
//   "side": "left",
//   "id": 5
//  },
//  {
//   "type": "clause",
//   "facet": "location",
//   "value": "mexico",
//   "clauseOperator": "equalTo",
//   "parent": 2,
//   "side": "right",
//   "id": 6
//  },
//  {
//   "type": "expression",
//   "operator": "or",
//   "parent": 1,
//   "left": 8,
//   "right": 9,
//   "side": "left",
//   "id": 7
//  },
//  {
//   "type": "clause",
//   "facet": "ki",
//   "value": "15",
//   "clauseOperator": "equalTo",
//   "parent": 7,
//   "side": "left",
//   "id": 8
//  },
//  {
//   "type": "clause",
//   "facet": "adasd",
//   "value": 18,
//   "clauseOperator": "equalTo",
//   "parent": 7,
//   "side": "right",
//   "id": 9
//  }
// ];

export default function canvas(state = initialState, action) {
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
