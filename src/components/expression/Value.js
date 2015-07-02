import React, { PropTypes } from 'react';

export default class Value {
  render() {
    const { expression } = this.props;

    let value = expression.value ?
      (
        <div className="Clause-Value">{ expression.value }</div>
      ) :
      (
        <form className="Clause-ValueForm" onSubmit={ this.setValue.bind(this) }>
          <input
          placeholder="Value"
          ref="facetValue"
          onKeyDown={this.setValueFromTabKey.bind(this)} />
        </form>
      );

    return value;
  }

  setValueFromTabKey(e) {
    if (e.keyCode === 9 || e.keyCode === '9') {
      const { expression, setClauseValue } = this.props;
      let value = React.findDOMNode(this.refs.facetValue).value;

      expression.value = value;
      setClauseValue(expression);
    }
  }

  setValue(e) {
    e.preventDefault();
    const { expression, setClauseValue } = this.props;
    let value = React.findDOMNode(this.refs.facetValue).value;

    expression.value = value;
    setClauseValue(expression);
  }
}

Value.propTypes = {
  expression: PropTypes.object.isRequired
};
