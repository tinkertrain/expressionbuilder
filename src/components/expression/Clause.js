import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Facet from './Facet';
import ClauseOperator from './ClauseOperator';
import Value from './Value';
import Remover from './Remover';

export default class Clause extends Component {
  render() {
    const { expression, setClauseFacet, setClauseValue, setClauseOperator, removeExpression } = this.props;

    return (
      <div
      className={
        classNames({
          Clause: true,
          highlight: this.state.highlightExpression
        }) }>
        <Facet
        expression = { expression }
        setClauseFacet = { setClauseFacet } />

        <ClauseOperator
        expression = { expression }
        setClauseOperator = { setClauseOperator } />

        <Value
        expression = { expression }
        setClauseValue = { setClauseValue } />

        <div
        className="Expression-RemoverWrapper"
        onMouseEnter = { this.highlightExpression.bind(this, true) }
        onMouseLeave = { this.highlightExpression.bind(this, false) } >
          <Remover
          expression = { expression }
          removeExpression = { removeExpression } />
        </div>

      </div>
    );
  }

  state = { highlightExpression: false }

  highlightExpression(highlight) {
    this.setState({ highlightExpression: highlight });
  }
}

Clause.propTypes = {
  expression: PropTypes.object.isRequired,
  setClauseFacet: PropTypes.func,
  setClauseOperator: PropTypes.func,
  setClauseValue: PropTypes.func,
  removeExpression: PropTypes.func
};
