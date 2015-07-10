import React from 'react';

import OperatorTool from './OperatorTool';
import ClauseTool from './ClauseTool';

export default class List {
  render() {
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
      </div>
    );
  }
}
