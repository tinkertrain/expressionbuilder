import React, { PropTypes } from 'react';

export default class QueryOperator {
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

QueryOperator.propTypes = {
  expression: PropTypes.object
};
