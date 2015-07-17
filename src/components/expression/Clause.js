import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import classNames from 'classnames';
import pureRender from '../../utils/pureRender';

import Facet from './Facet';
import ClauseOperator from './ClauseOperator';
import Value from './Value';
import Remover from './Remover';

class Clause extends Component {
  render() {
    const { expression, facetList, setClauseFacet, setClauseValue, setClauseOperator, removeExpression } = this.props;

    return (
      <div
      className={
        classNames({
          Clause: true,
          highlight: this.state.highlightExpression
        }) }>
        <Facet
        expression = { expression }
        facetList = { facetList }
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

pureRender(Clause);

export default Clause;

Clause.propTypes = {
  expression: PropTypes.instanceOf(Map).isRequired,
  facetList: PropTypes.array,
  setClauseFacet: PropTypes.func,
  setClauseOperator: PropTypes.func,
  setClauseValue: PropTypes.func,
  removeExpression: PropTypes.func
};
