import R from 'ramda';
import React, { Component, PropTypes } from 'react';

import { clauseOperators } from 'queryapi';
import { queryOperators } from 'queryapi';

import FuseDial from './FuseDial';

export default class FuseExpression extends Component {
  render() {
    const { canvas, fuse, dialFuse, getResults, saveExpression } = this.props;
    let rootExpression = 'Incomplete';
    let dial = '';

    if (canvas.length && this.isCanvasComplete(canvas)) {
      let prepared = this.prepareCanvas(R.clone(canvas));
      rootExpression = R.find(R.propEq('id', 0), prepared).resolved;
    }

    if (rootExpression !== 'Incomplete' && !R.isNil(fuse.endPoint)) {
      dial = (
        <FuseDial
        fuse = { fuse }
        dialFuse = { dialFuse }
        getResults = { getResults }
        expression = { rootExpression } />
      );
    }
    else if (rootExpression === 'Incomplete' && R.isNil(fuse.endPoint)) {
      dial = <span className="FuseExpression-setEndPoint">Set a Fuse URL to see a response made with your expression</span>;
    }

    return (
      <div className="FuseExpression">
        <h2>Fuse Expression</h2>
        <pre>
          { rootExpression }
        </pre>
        { dial }
      </div>
    );
  }

  isCanvasComplete(canvas) {
    let clauses = R.filter(R.propEq('type', 'clause'), canvas);
    let expressions = R.filter(R.propEq('type', 'expression'), canvas);

    let facetDefined = (c) => !R.isNil(c.facet);
    let valueDefined = (c) => !R.isNil(c.value);
    let rightSideDefined = (e) => !R.isNil(e.right);
    let leftSideDefined = (e) => !R.isNil(e.left);
    let clausesPass = R.allPass([facetDefined, valueDefined]);
    let expressionsPass = R.allPass([rightSideDefined, leftSideDefined]);

    return R.all(clausesPass, clauses) && R.all(expressionsPass, expressions);
  }

  prepareCanvas(canvas) {
    let clausesResolved = R.map((exp) => {
      if (exp.type === 'clause') {
        exp.resolved = clauseOperators[exp.clauseOperator](exp.facet, exp.value);
      }
      return exp;
    }, canvas);

    return traverseCanvas(R.clone(clausesResolved));
  }

  resolveExpressions(expressionsGrouped, canvas) {
    let withId = R.propEq('id');
    let onSide = R.propEq('side');

    return R.mapObjIndexed((parent, key) => {
      if (R.all((e) => e.resolved, parent)) {
        let parentExpression = R.find(withId(parseInt(key, 10)), canvas);
        let leftSide = R.find(onSide('left'), parent);
        let rightSide = R.find(onSide('right'), parent);

        parentExpression.resolved = queryOperators[parentExpression.operator](leftSide.resolved, rightSide.resolved);

        return parentExpression;
      }

      let unresolved = R.filter((exp) => R.isNil(exp.resolved), parent);
      let resolveUnresolved = R.map((exp) => {
        let right = R.find(withId(exp.right), canvas).resolved;
        let left = R.find(withId(exp.left), canvas).resolved;
        exp.resolved = queryOperators[exp.operator](left, right);
        return exp;
      }, unresolved);

      return resolveUnresolved;
    }, expressionsGrouped);
  }

}

FuseExpression.propTypes = {
  canvas: PropTypes.array.isRequired,
  fuse: PropTypes.object.isRequired,
  dialFuse: PropTypes.func,
  saveExpression: PropTypes.func,
  getResults: PropTypes.func
};

function traverseCanvas(myCanvas) {
  let withId = R.propEq('id');

  for (let i = 0; i < myCanvas.length; i++) {
    let exp = myCanvas[i];
    let left = R.find(withId(exp.left), myCanvas);
    let right = R.find(withId(exp.right), myCanvas);

    if (exp.type === 'expression') {
      if (R.isNil(exp.resolved)) {
        if (left.resolved && right.resolved) {
          exp.resolved = queryOperators[exp.operator](left.resolved, right.resolved);
        }
      }
    }
  }

  if (R.reject((exp) => exp.resolved, myCanvas).length > 0) {
    traverseCanvas(myCanvas);
  }

  return myCanvas;
}
