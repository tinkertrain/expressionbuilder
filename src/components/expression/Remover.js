import React, { PropTypes } from 'react';

export default class Remover {
  render() {
    const { expression, removeExpression } = this.props;

    return (
      <button
      className="Expression-Remover"
      onClick={ removeExpression.bind(this, expression) } >
        &times;
      </button>
    );
  }
}

Remover.propTypes = {
  expression: PropTypes.object.isRequired,
  removeExpression: PropTypes.func.isRequired
};
