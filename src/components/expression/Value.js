import R from 'ramda';
import React, { Component, PropTypes } from 'react';

export default class Value extends Component {
  render() {
    const { expression } = this.props;

    let value = expression.value && !this.state.editMode ?
      (
        <div
        className="Clause-Value"
        onClick={this.editValue.bind(this)}>
          { expression.value }
        </div>
      ) :
      (
        <form className="Clause-ValueForm" onSubmit={ this.setValue.bind(this) }>
          <input
          placeholder="Value"
          ref="facetValue"
          defaultValue={ expression.value || ''}
          onKeyDown={this.setValueFromTabKey.bind(this)} />
        </form>
      );

    return value;
  }

  state = { editMode: true }

  componentDidUpdate() {
    if (!R.isNil(this.refs.facetValue)) {
      this.refs.facetValue.getDOMNode().select();
      this.refs.facetValue.getDOMNode().focus();
    }
  }

  setValueFromTabKey(e) {
    if (e.keyCode === 9 || e.keyCode === '9') {
      const { expression, setClauseValue } = this.props;
      let value = React.findDOMNode(this.refs.facetValue).value;

      expression.value = value;
      setClauseValue(expression);

      this.setState({ editMode: false});
    }
  }

  setValue(e) {
    e.preventDefault();
    const { expression, setClauseValue } = this.props;
    let value = React.findDOMNode(this.refs.facetValue).value;

    expression.value = value;
    setClauseValue(expression);

    this.setState({ editMode: false});
  }

  editValue() {
    this.setState({ editMode: true});
  }
}

Value.propTypes = {
  expression: PropTypes.object.isRequired
};
