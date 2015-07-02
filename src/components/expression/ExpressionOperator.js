import React, { PropTypes } from 'react';

import And from '../icons/And';
import Or from '../icons/Or';
import Not from '../icons/Not';


export default class ExpressionOperator {
  render() {
    const { operator } = this.props;
    const icon = {
      and: (
        <div className="OperatorTool-icon OperatorTool-icon--and">
          <And id="Icon-and" height="17" width="10" color="#fff" />
        </div>
      ),
      or: (
        <div className="OperatorTool-icon OperatorTool-icon--or">
          <Or id="Icon-or" height="17" width="10" color="#fff" />
        </div>
      ),
      orNot: (
        <div className="OperatorTool-icon OperatorTool-icon--orNot">
          <Or id="Icon-orNot--or" height="17" width="10" color="#fff" />
          <Not id="Icon-orNot--not" height="17" width="10" color="#fff" />
        </div>
      ),
      andNot: (
        <div className="OperatorTool-icon OperatorTool-icon--andNot">
          <And id="Icon-andNot--or" height="17" width="10" color="#fff" />
          <Not id="Icon-andNot--not" height="17" width="10" color="#fff" />
        </div>
      )
    };

    return (
      <div className="Expression-operator">{ icon[operator] }</div>
    );
  }
}

ExpressionOperator.propTypes = {
  operator: PropTypes.string.isRequired
};
