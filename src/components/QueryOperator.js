import React, { PropTypes } from 'react';
import pureRender from '../utils/pureRender';

class QueryOperator {
  render() {
    const { expression } = this.props;

    return (
      <div>
        <div style={{
              width: '20px',
              height: '20px',
              lineHeight: '36px',
              backgroundColor: 'green',
              padding: '10px',
              display: 'inline-block',
              color: 'white',
              verticalAlign: 'middle',
              textAlign: 'center'
          }}>{ expression.operator }</div>
      </div>
    );
  }
}

pureRender(QueryOperator);

export default QueryOperator;

QueryOperator.propTypes = {
  expression: PropTypes.object
};
