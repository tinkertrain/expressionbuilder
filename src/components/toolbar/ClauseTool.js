import R from 'ramda';
import { Map } from 'immutable';
import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import DnDTypes from '../../constants/DnDTypes';
import pureRender from '../../utils/pureRender';

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
    let dropResult = monitor.getDropResult();
    const canvas = dropResult.builder.get('canvas');
    let generateId = R.compose(
      R.add(1),
      R.max
    );
    let idList = canvas.map((exp) => exp.get('id')).toArray();
    dropResult.addExpression(Map({
      type: 'clause',
      facet: null,
      value: null,
      clauseOperator: props.clauseOperator || 'equalTo',
      parent: dropResult.id,
      side: dropResult.side,
      id: canvas.size === 0 ?
        0 :
        generateId(idList)
    }));
  }
};

@DragSource(DnDTypes.TOOL, clauseToolSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class ClauseTool {
  render() {
    const { isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div className="ClauseTool">Clause</div>
    );
  }
}

pureRender(ClauseTool);

export default ClauseTool;

ClauseTool.propTypes = {
  isDragging: PropTypes.func,
  connectDragSource: PropTypes.func
};
