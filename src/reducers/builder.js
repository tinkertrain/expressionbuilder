import { Map, List } from 'immutable';
import { clauseOperators } from 'queryapi';
import { queryOperators } from 'queryapi';

import * as aT from '../constants/ActionTypes';

let initialState = Map({
  canvas: List(),
  fuse: Map({ expression: 'incomplete'})
});

export default function builder(state = initialState, action) {
  const canvas = state.get('canvas');
  const fuse = state.get('fuse');
  const expression = action.expression;
  let newCanvas;
  let newFuse;

  switch (action.type) {
    case aT.ADD_EXPRESSION:
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

    case aT.REMOVE_EXPRESSION:
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

        newCanvas = updatedParent.filterNot((exp) => children.indexOf(exp.get('id')) !== -1);
      }
    else {
      newCanvas = List();
    }
      newFuse = saveExpression(newCanvas, fuse);

      return Map({
        canvas: newCanvas,
        fuse: newFuse.get('expression') !== fuse.get('expression') ?
          newFuse
          .set('response', null)
          .set('facets', null)
          .set('contents', null) :
          newFuse
      });

    case aT.SET_CLAUSE_FACET:
      newCanvas = mapUpdate('facet', expression, canvas);
      newFuse = saveExpression(newCanvas, fuse);

      return Map({
        canvas: newCanvas,
        fuse: newFuse.get('expression') !== fuse.get('expression') ?
          newFuse
          .set('response', null)
          .set('facets', null)
          .set('contents', null) :
          newFuse
      });

    case aT.SET_CLAUSE_VALUE:
      newCanvas = mapUpdate('value', expression, canvas);
      newFuse = saveExpression(newCanvas, fuse);

      return Map({
        canvas: newCanvas,
        fuse: newFuse.get('expression') !== fuse.get('expression') ?
          newFuse
          .set('response', null)
          .set('facets', null)
          .set('contents', null) :
          newFuse
      });

    case aT.SET_CLAUSE_OPERATOR:
      newCanvas = mapUpdate('clauseOperator', expression, canvas);
      newFuse = saveExpression(newCanvas, fuse);

      return Map({
        canvas: newCanvas,
        fuse: newFuse.get('expression') !== fuse.get('expression') ?
          newFuse
          .set('response', null)
          .set('facets', null)
          .set('contents', null) :
          newFuse
      });

    case aT.SET_FUSE_ENDPOINT:
      return Map({
        canvas: canvas,
        fuse: fuse.set('endPoint', action.url)
      });

    case aT.DIAL_FUSE:
      return Map({
        canvas: canvas,
        fuse: fuse.set('response', action.response)
      });

    case aT.GET_FACETS:
      return Map({
        canvas: canvas,
        fuse: fuse.set('facets', action.items)
      });

    case aT.GET_CONTENTS:
      return Map({
        canvas: canvas,
        fuse: fuse.set('contents', action.items)
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

function saveExpression(canvas, fuse) {
  if (canvas.size && isCanvasComplete(canvas)) {
    let prepared = prepareCanvas(canvas);
    let traversed = traverseCanvas(prepared);
    let parsed = traversed.find((exp) => exp.get('id') === 0).get('resolved');

    return fuse.set('expression', parsed);
  }
  return fuse.set('expression', 'incomplete');
}

function isCanvasComplete(canvas) {
  let clauses = canvas
    .filter((exp) => exp.get('type') === 'clause')
    .skipWhile((exp) => exp.get('facet') && exp.get('value'));
  let expressions = canvas
    .filter((exp) => exp.get('type') === 'expression')
    .skipWhile((exp) => exp.get('left') && exp.get('right'));

  return clauses.size === 0 && expressions.size === 0;
}

function prepareCanvas(canvas) {
  let resolvedClauses = canvas.map((exp) => {
    if (exp.get('type') === 'clause') {
      return exp.set(
        'resolved',
        clauseOperators[exp.get('clauseOperator')](exp.get('facet'), exp.get('value'))
        );
    }
    return exp;
  });

  return resolvedClauses;
}

function traverseCanvas(canvas) {
  let rootResolved = canvas.find((exp) => exp.get('id') === 0).get('resolved');
  if (rootResolved) {
    return canvas;
  }
  let resolvingCanvas = canvas.map((exp) => {
    let left = canvas.find((e) => e.get('id') === exp.get('left'));
    let right = canvas.find((e) => e.get('id') === exp.get('right'));

    if (exp.get('type') === 'expression') {
      if (!exp.get('resolved')) {
        if (left.get('resolved') && right.get('resolved')) {
          return exp.set('resolved',
            queryOperators[exp.get('operator')](left.get('resolved'), right.get('resolved'))
          );
        }
        return exp;
      }
      return exp;
    }
    return exp;
  });

  return traverseCanvas(resolvingCanvas);
}
