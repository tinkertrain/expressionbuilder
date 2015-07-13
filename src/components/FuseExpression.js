import React, { PropTypes } from 'react';
import pureRender from '../utils/pureRender';

class FuseExpression {
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

pureRender(FuseExpression);

export default FuseExpression;

FuseExpression.propTypes = {
  expressionString: PropTypes.string.isRequired
};
