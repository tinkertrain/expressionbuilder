import R from 'ramda';
import { Map, List } from 'immutable';

import { ADD_EXPRESSION, SET_CLAUSE_FACET, SET_CLAUSE_VALUE, SET_CLAUSE_OPERATOR, REMOVE_EXPRESSION } from '../constants/ActionTypes';

let initialState = Map({
  canvas: List(),
  fuse: Map()
});

export default function builder(state = initialState, action) {
  const canvas = state.get('canvas');
  const expression = action.expression;
  let newCanvas;

  switch (action.type) {
    case ADD_EXPRESSION:
      if (canvas.size !== 0) {
        let updatedParent = canvas.map((exp) => {
          if (exp.get('id') === expression.get('parent')) {
            return exp.set(expression.get('side'), expression.get('id'));
          }
          return exp;
        });
        newCanvas = updatedParent.push(expression);
      }
      else {
        newCanvas = canvas.push(expression);
      }

      return Map({
        canvas: newCanvas,
        fuse: state.get('fuse')
      });

    case REMOVE_EXPRESSION:
      let parentIndex = canvas.findIndex((exp) => exp.get('id') === expression.get('parent'));

      if (parentIndex > -1) {
        let children = canvas.reduce((accum, exp) => {
          for (let i = 0; i < accum.length; i++) {
            if (exp.get('parent') === accum[i]) {
              return accum.concat(exp.get('id'));
            }
          }
          return accum;
        }, [expression.get('id')]);

        let updatedParent = canvas.map((exp) => {
          if (exp.get('id') === expression.get('parent')) {
            return exp.set(expression.get('side'), null);
          }
          return exp;
        });

        newCanvas = updatedParent.filterNot((exp) => R.contains(exp.get('id'), children));
      }
      else {
        newCanvas = List();
      }

      return Map({
        canvas: newCanvas,
        fuse: state.get('fuse')
      });

    case SET_CLAUSE_FACET:
      return Map({
        canvas: mapUpdate('facet', expression, canvas),
        fuse: state.get('fuse')
      });

    case SET_CLAUSE_VALUE:
      return Map({
        canvas: mapUpdate('value', expression, canvas),
        fuse: state.get('fuse')
      });

    case SET_CLAUSE_OPERATOR:
      return Map({
        canvas: mapUpdate('clauseOperator', expression, canvas),
        fuse: state.get('fuse')
      });

    default:
      return state;
  }
}

function mapUpdate(val, expression, list) {
  return list.map((exp) => {
    if (exp.get('id') === expression.get('id')) {
      return exp.set(val, expression.get(val));
    }
    return exp;
  });
}
