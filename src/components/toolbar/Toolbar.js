import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import pureRender from '../../utils/pureRender';

import OperatorTool from './OperatorTool';
import ClauseTool from './ClauseTool';
import Filler from './Filler';

class Toolbar {
  render() {
    const { fillEmpty, builder } = this.props;
    const operators = ['and', 'or', 'andNot', 'orNot'];
    const Operators = operators.map(function generateOperators(q, i) {
      return (
        <OperatorTool
        operator={q}
        key={i + 1}
        />
      );
    });

    return (
      <div className="Toolbar">
        <ClauseTool />
        { Operators }
        <Filler fillEmpty = { fillEmpty } builder = { builder } />
      </div>
    );
  }
}

pureRender(Toolbar);

export default Toolbar;

Toolbar.propTypes = {
  fillEmpty: PropTypes.func,
  builder: PropTypes.instanceOf(Map)
};
