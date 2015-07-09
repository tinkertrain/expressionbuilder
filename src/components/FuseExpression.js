import React, { PropTypes } from 'react';

export default class FuseExpression {
  render() {
    const { expressionString } = this.props;

    return (
      <div className="FuseExpression">
        <h2>Fuse Expression</h2>
        <pre>
          { expressionString }
        </pre>
      </div>
    );
  }

}

FuseExpression.propTypes = {
  expressionString: PropTypes.string.isRequired
};
