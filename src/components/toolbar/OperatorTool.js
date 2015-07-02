import R from 'ramda';
import React, { PropTypes } from 'react';

import { DragSource } from 'react-dnd';
import DnDTypes from '../../constants/DnDTypes';

import And from '../icons/And';
import Or from '../icons/Or';
import Not from '../icons/Not';

let operandSource = {
  beginDrag() {
    return {
      type: 'operator'
    };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    let generateId = R.compose(
      R.add(1),
      R.max,
      R.pluck('id')
    );
    let dropResult = monitor.getDropResult();

    dropResult.addExpression({
      type: 'expression',
      operator: props.operator,
      parent: dropResult.canvas.length > 0 ? dropResult.id : null,
      left: null,
      right: null,
      side: dropResult.side || null,
      id: dropResult.canvas.length === 0 ?
        0 :
        generateId(dropResult.canvas)
    });
  }
};

@DragSource(DnDTypes.TOOL, operandSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class OperatorTool {
  render() {
    const { operator } = this.props;
    const { isDragging, connectDragSource } = this.props;
    const icon = {
      and: (
        <div className="OperatorTool-icon OperatorTool-icon--and">
          <And id="Icon-and" height="17" width="10" color="#B0C4DE" />
        </div>
      ),
      or: (
        <div className="OperatorTool-icon OperatorTool-icon--or">
          <Or id="Icon-or" height="17" width="10" color="#B0C4DE" />
        </div>
      ),
      orNot: (
        <div className="OperatorTool-icon OperatorTool-icon--orNot">
          <Or id="Icon-orNot--or" height="17" width="10" color="#B0C4DE" />
          <Not id="Icon-orNot--not" height="17" width="10" color="#B0C4DE" />
        </div>
      ),
      andNot: (
        <div className="OperatorTool-icon OperatorTool-icon--andNot">
          <And id="Icon-andNot--or" height="17" width="10" color="#B0C4DE" />
          <Not id="Icon-andNot--not" height="17" width="10" color="#B0C4DE" />
        </div>
      )
    };

    return connectDragSource(
      <div className="OperatorTool">
        { icon[operator] }
      </div>
    );
  }
}

OperatorTool.propTypes = {
  operator: PropTypes.string.isRequired,
  isDragging: PropTypes.func,
  connectDragSource: PropTypes.func
};
