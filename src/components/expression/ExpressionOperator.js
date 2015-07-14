import React, { Component, PropTypes } from 'react/addons';
import classNames from 'classnames';
import pureRender from '../../utils/pureRender';
import { Map } from 'immutable';

import And from '../icons/And';
import Or from '../icons/Or';
import Not from '../icons/Not';

class ExpressionOperator extends Component {
  render() {
    const { expression } = this.props;
    const operator = expression.get('operator');

    const icon = {
      and: (
        <div
        className="OperatorTool-icon OperatorTool-icon--and"
        onClick={ this.setOperator.bind(this, 'and')}>
          <And id="Icon-and" height="17" width="10" color="#fff" />
        </div>
      ),
      or: (
        <div
        className="OperatorTool-icon OperatorTool-icon--or"
        onClick={ this.setOperator.bind(this, 'or')}>
          <Or id="Icon-or" height="17" width="10" color="#fff" />
        </div>
      ),
      orNot: (
        <div
        className="OperatorTool-icon OperatorTool-icon--orNot"
        onClick={ this.setOperator.bind(this, 'orNot')}>
          <Or id="Icon-orNot--or" height="17" width="10" color="#fff" />
          <Not id="Icon-orNot--not" height="17" width="10" color="#fff" />
        </div>
      ),
      andNot: (
        <div
        className="OperatorTool-icon OperatorTool-icon--andNot"
        onClick={ this.setOperator.bind(this, 'andNot')}>
          <And id="Icon-andNot--or" height="17" width="10" color="#fff" />
          <Not id="Icon-andNot--not" height="17" width="10" color="#fff" />
        </div>
      )
    };

    return (
      <div
      className="Expression-operator"
      onClick={ this.toggleOperator.bind(this) }>
        { icon[operator] }
         <ul className={ classNames({
          'Expression-operator-List': true,
          show: this.state.showOperators
        })}>
          { React.addons.createFragment(icon) }
        </ul>
      </div>
    );
  }

  state = { showOperators: false }

  toggleOperator() {
    this.setState({ showOperators: !this.state.showOperators });
  }

  setOperator(operator) {
    const { expression, changeExpressionOperator } = this.props;

    if (expression.get('operator') !== operator) {
      changeExpressionOperator(expression.set('operator', operator));
    }
  }
}

pureRender(ExpressionOperator);

export default ExpressionOperator;

ExpressionOperator.propTypes = {
  expression: PropTypes.instanceOf(Map).isRequired,
  changeExpressionOperator: PropTypes.func
};
