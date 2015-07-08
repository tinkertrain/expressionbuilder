import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

import * as CanvasActions from '../../actions/CanvasActions';

import Placeholder from './Placeholder';
import ExpressionOperator from './ExpressionOperator';
import Clause from './Clause';
import Remover from './Remover';

@connect(state => ({
  builder: state.builder
}))
export default class Expression extends Component {
  render() {
    const { id, builder } = this.props;
    const { dispatch } = this.props;

    let leftSide;
    let rightSide;
    const canvas = builder.get('canvas');
    const expression = canvas.find((exp) => exp.get('id') === id);

    if (expression.get('left')) {
      const leftExpression = canvas.find((exp) => exp.get('id') === expression.get('left'));

      if (leftExpression.get('type') === 'clause') {
        leftSide = (
          <Clause
          expression = { leftExpression }
          {...bindActionCreators(CanvasActions, dispatch)} />
        );
      }
      if (leftExpression.get('type') === 'expression') {
        leftSide = (
          <Expression
          id = { leftExpression.get('id') }
          key = { leftExpression.get('id') }
          builder = { builder } />
        );
      }
    }
    else {
      leftSide = (
        <Placeholder
        builder = { builder }
        side = "left"
        id = { id }
        {...bindActionCreators(CanvasActions, dispatch)} />
      );
    }

    if (expression.get('right')) {
      let rightExpression = canvas.find((exp) => exp.get('id') === expression.get('right'));

      if (rightExpression.get('type') === 'clause') {
        rightSide = (
          <Clause
          expression = { rightExpression }
          {...bindActionCreators(CanvasActions, dispatch)} />
        );
      }
      if (rightExpression.get('type') === 'expression') {
        rightSide = (
          <Expression
          id = { rightExpression.get('id') }
          key = { rightExpression.get('id') }
          builder = { builder } />
        );
      }
    }
    else {
      rightSide = (
        <Placeholder
        builder = { builder }
        side = "right"
        id = { id }
        {...bindActionCreators(CanvasActions, dispatch)} />
      );
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
        <ExpressionOperator operator = { expression.get('operator') } />
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
  builder: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func
};
