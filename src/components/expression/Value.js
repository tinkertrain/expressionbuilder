import { Map } from 'immutable';
import React, { Component, PropTypes } from 'react';

export default class Value extends Component {
  render() {
    const { expression } = this.props;

    let value = expression.get('value') && !this.state.editMode ?
      (
        <div
        className="Clause-Value"
        onClick={this.editValue.bind(this)}>
          { expression.get('value') }
        </div>
      ) :
      (
        <form className="Clause-ValueForm" onSubmit={ this.setValue.bind(this) }>
          <input
          placeholder="Value"
          ref="facetValue"
          defaultValue={ expression.get('value') || ''}
          onKeyDown={this.setValueFromTabKey.bind(this)} />
        </form>
      );

    return value;
  }

  state = { editMode: true }

  componentDidUpdate() {
    if (this.refs.facetValue) {
      React.findDOMNode(this.refs.facetValue).select();
      React.findDOMNode(this.refs.facetValue).focus();
    }
  }

  setValueFromTabKey(e) {
    if (e.keyCode === 9 || e.keyCode === '9') {
      const { expression, setClauseValue } = this.props;
      let value = React.findDOMNode(this.refs.facetValue).value;

      setClauseValue(expression.set('value', value));

      this.setState({ editMode: false});
    }
  }

  setValue(e) {
    e.preventDefault();
    const { expression, setClauseValue } = this.props;
    let value = React.findDOMNode(this.refs.facetValue).value;

    setClauseValue(expression.set('value', value));

    this.setState({ editMode: false});
  }

  editValue() {
    this.setState({ editMode: true});
  }
}

Value.propTypes = {
  expression: PropTypes.instanceOf(Map).isRequired
};
