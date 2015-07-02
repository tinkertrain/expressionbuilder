import R from 'ramda';
import React, { PropTypes } from 'react';

import { DragSource } from 'react-dnd';
import DnDTypes from '../../constants/DnDTypes';

let clauseToolSource = {
  beginDrag() {
    return {
      type: 'clause'
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
      type: 'clause',
      facet: null,
      value: null,
      clauseOperator: props.clauseOperator || 'equalTo',
      parent: dropResult.id,
      side: dropResult.side,
      id: dropResult.canvas.length === 0 ?
        0 :
        generateId(dropResult.canvas)
    });
  }
};

@DragSource(DnDTypes.TOOL, clauseToolSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class ClauseTool {
  render() {
    const { isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div className="ClauseTool">
        Clause
      </div>
    );
  }
}

ClauseTool.propTypes = {
  isDragging: PropTypes.func,
  connectDragSource: PropTypes.func
};
