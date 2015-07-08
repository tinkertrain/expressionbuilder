import R from 'ramda';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ClauseOperator extends Component {
  render() {
    const { expression } = this.props;
    const symbols = {
      equalTo: '=',
      greaterThan: '>',
      greaterOrEqualTo: '>=',
      lowerThan: '<',
      lowerOrEqualTo: '<='
    };
    let key = 1;
    let symbolList = R.values(
      R.mapObj(
        (s) => <li key={key++} onClick={ this.setOperator.bind(this, s) }>{s}</li>,
        symbols)
      );

    return (
      <div
      className="Clause-Operator"
      onClick={ this.toggleOperators.bind(this) }
      >
        <div>{ symbols[expression.get('clauseOperator')] }</div>
        <ul className={
          classNames({
            ['Clause-Operator-List']: true,
            show: this.state.showOperators
          })
          }>
          { symbolList }
        </ul>
      </div>
    );
  }

  state = { showOperators: false }

  setOperator(operator) {
    const symbols = {
      ['=']: 'equalTo',
      ['>']: 'greaterThan',
      ['>=']: 'greaterOrEqualTo',
      ['<']: 'lowerThan',
      ['<=']: 'lowerOrEqualTo',
      ['!=']: 'not'
    };
    this.props.setClauseOperator(this.props.expression.set('clauseOperator', symbols[operator]));
  }

  toggleOperators() {
    this.setState({ showOperators: !this.state.showOperators });
  }
}

ClauseOperator.propTypes = {
  expression: PropTypes.object.isRequired,
  setClauseOperator: PropTypes.func
};
