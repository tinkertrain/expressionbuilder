import R from 'ramda';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

import * as CanvasActions from '../../actions/CanvasActions';

import Placeholder from './Placeholder';
import ExpressionOperator from './ExpressionOperator';
import Clause from './Clause';
import Remover from './Remover';

@connect(state => ({
  canvas: state.canvas
}))
export default class Expression extends Component {
  render() {
    const { id, canvas } = this.props;
    const { dispatch } = this.props;

    let leftSide;
    let rightSide;
    let expression = R.find(R.propEq('id', id), canvas);
    if (R.isNil(expression.left)) {
      leftSide = (
        <Placeholder
        canvas = { canvas }
        side = "left"
        id = { id }
        {...bindActionCreators(CanvasActions, dispatch)} />
      );
    }
    else {
      let leftExpression = R.find(R.propEq('id', expression.left), canvas);

      if (leftExpression.type === 'clause') {
        leftSide = (
          <Clause
          expression = { leftExpression }
          {...bindActionCreators(CanvasActions, dispatch)} />
        );
      }
      if (leftExpression.type === 'expression') {
        leftSide = (
          <Expression
          id = { leftExpression.id }
          key = { leftExpression.id }
          canvas = { canvas } />
        );
      }
    }

    if (R.isNil(expression.right)) {
      rightSide = (
        <Placeholder
        canvas = { canvas }
        side = "right"
        id = { id }
        {...bindActionCreators(CanvasActions, dispatch)} />
      );
    }
    else {
      let rightExpression = R.find(R.propEq('id', expression.right), canvas);

      if (rightExpression.type === 'clause') {
        rightSide = (
          <Clause
          expression = { rightExpression }
          {...bindActionCreators(CanvasActions, dispatch)} />
        );
      }
      if (rightExpression.type === 'expression') {
        rightSide = (
          <Expression
          id = { rightExpression.id }
          key = { rightExpression.id }
          canvas = { canvas } />
        );
      }
    }

    return (
      <div
      className={
        classNames({
          Expression: true,
          highlight: this.state.highlightExpression
        })
      }>
        { leftSide }
        <ExpressionOperator operator = { expression.operator } />
        { rightSide }
        <div
        className = "Expression-RemoverWrapper"
        onMouseEnter = { this.highlightExpression.bind(this, true) }
        onMouseLeave = { this.highlightExpression.bind(this, false) } >
          <Remover
          expression = { expression }
          {...bindActionCreators(CanvasActions, dispatch)} />
        </div>
      </div>
    );
  }

  state = { highlightExpression: false }

  highlightExpression(highlight) {
    this.setState({ highlightExpression: highlight });
  }
}

Expression.propTypes = {
  id: PropTypes.number.isRequired,
  canvas: PropTypes.array.isRequired,
  dispatch: PropTypes.func
};
