import R from 'ramda';
import { Map, List } from 'immutable';
import * as canvasUtils from '../utils/canvasUtils';
import * as aT from '../constants/ActionTypes';

let initialState = Map({
  canvas: List(),
  fuse: Map({ expression: 'incomplete' })
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
      fuse: fuse
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

    case aT.CHANGE_EXPRESSION_OPERATOR:
    newCanvas = mapUpdate('operator', expression, canvas);
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

    case aT.FILL_EMPTY:
    let generateId = R.compose(
      R.add(1),
      R.max
    );
    let idList = canvas.map((exp) => exp.get('id')).toArray();
    let clausesToAdd = [];

    newCanvas = canvas.map((exp) => {
      if (exp.get('type') === 'expression') {
        let leftId;
        let rightId;

        if (!exp.get('left')) {
          leftId = generateId(idList);
          clausesToAdd.push(Map({
            type: 'clause',
            facet: null,
            value: null,
            clauseOperator: 'equalTo',
            parent: exp.get('id'),
            side: 'left',
            id: leftId
          }));
          idList.push(leftId);
        }
        else {
          leftId = exp.get('left');
        }
        if (!exp.get('right')) {
          rightId = generateId(idList);
          clausesToAdd.push(Map({
            type: 'clause',
            facet: null,
            value: null,
            clauseOperator: 'equalTo',
            parent: exp.get('id'),
            side: 'right',
            id: rightId
          }));
          idList.push(rightId);
        }
        else {
          rightId = exp.get('right');
        }

        return exp.set('left', leftId).set('right', rightId);
      }
      return exp;
    });

    return Map({
      canvas: newCanvas.concat(List(clausesToAdd)),
      fuse: fuse
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
      fuse: fuse
        .set('endPoint', action.response.url)
        .set('facetList', action.response.facetList)
    });

    case aT.DIAL_FUSE:
    return Map({
      canvas: canvas,
      fuse: fuse.set('response', action.response)
    });

    case aT.GET_FACETS:
    return Map({
      canvas: canvas,
      fuse: fuse
            .set('facets', List(action.payload.items))
            .set('facetsQParams', Map(action.payload.qParams))
    });

    case aT.GET_CONTENTS:
    return Map({
      canvas: canvas,
      fuse: fuse
            .set('contents', List(action.payload.items))
            .set('contentsQParams', Map(action.payload.qParams))
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
  if (canvas.size && canvasUtils.isCanvasComplete(canvas)) {
    let prepared = canvasUtils.prepareCanvas(canvas);
    let traversed = canvasUtils.traverseCanvas(prepared);
    let parsed = traversed.find((exp) => exp.get('id') === 0).get('resolved');

    return fuse.set('expression', parsed);
  }
  return fuse.set('expression', 'incomplete');
}

