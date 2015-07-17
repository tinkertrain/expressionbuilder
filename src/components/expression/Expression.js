import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';
import pureRender from '../../utils/pureRender';

import * as BuilderActions from '../../actions/BuilderActions';

import Placeholder from './Placeholder';
import ExpressionOperator from './ExpressionOperator';
import Clause from './Clause';
import Remover from './Remover';

@connect(state => ({
  builder: state.builder
}))
class Expression extends Component {
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
          facetList = { builder.get('fuse').get('facetList') }
          expression = { leftExpression }
          {...bindActionCreators(BuilderActions, dispatch)} />
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
        {...bindActionCreators(BuilderActions, dispatch)} />
      );
    }

    if (expression.get('right')) {
      let rightExpression = canvas.find((exp) => exp.get('id') === expression.get('right'));

      if (rightExpression.get('type') === 'clause') {
        rightSide = (
          <Clause
          facetList = { builder.get('fuse').get('facetList') }
          expression = { rightExpression }
          {...bindActionCreators(BuilderActions, dispatch)} />
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
        {...bindActionCreators(BuilderActions, dispatch)} />
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
        <ExpressionOperator
        expression = { expression }
        {...bindActionCreators(BuilderActions, dispatch)}/>
        { rightSide }
        <div
        className = "Expression-RemoverWrapper"
        onMouseEnter = { this.highlightExpression.bind(this, true) }
        onMouseLeave = { this.highlightExpression.bind(this, false) } >
          <Remover
          expression = { expression }
          {...bindActionCreators(BuilderActions, dispatch)} />
        </div>
      </div>
    );
  }

  state = { highlightExpression: false }

  componentDidUpdate() {
    let inputs = document.querySelectorAll('.Expression input');

    if (inputs.length) {
      Array.prototype.forEach.call(inputs, (input, index) => {
        if (index === 0) { input.focus(); }
        input.tabIndex = index + 2;
      });
    }
  }

  highlightExpression(highlight) {
    this.setState({ highlightExpression: highlight });
  }
}

pureRender(Expression);

export default Expression;

Expression.propTypes = {
  id: PropTypes.number.isRequired,
  builder: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func
};
