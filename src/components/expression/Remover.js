import { Map } from 'immutable';
import React, { PropTypes } from 'react';
import pureRender from '../../utils/pureRender';

class Remover {
  render() {
    const { expression, removeExpression } = this.props;

    return (
      <button
      className="Expression-Remover"
      tabIndex="-1"
      onClick={ removeExpression.bind(this, expression) } >
        &times;
      </button>
    );
  }
}

pureRender(Remover);

export default Remover;

Remover.propTypes = {
  expression: PropTypes.instanceOf(Map).isRequired,
  removeExpression: PropTypes.func.isRequired
};
