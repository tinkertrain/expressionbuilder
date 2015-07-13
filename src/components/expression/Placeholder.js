import React, { PropTypes } from 'react';
import classNames from 'classnames';
import pureRender from '../../utils/pureRender';

import { DropTarget } from 'react-dnd';
import DnDTypes from '../../constants/DnDTypes';

let placeholderTarget = {
  drop(props) {
    return props;
  },
  canDrop(props, monitor) {
    let item = monitor.getItem();

    return item.type === 'clause' || item.type === 'operator';
  }
};

@DropTarget(DnDTypes.TOOL, placeholderTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class Placeholder {
  render() {
    const { side } = this.props;
    const { connectDropTarget, isOver, canDrop } = this.props;

    return connectDropTarget(
      <div
      className = { classNames({
        Placeholder: true,
        canDrop: this.props.canDrop && this.props.isOver,
        noDrop: !this.props.canDrop && this.props.isOver
      }) }></div>
    );
  }
}

pureRender(Placeholder);

export default Placeholder;

Placeholder.propTypes = {
  side: PropTypes.string.isRequired,
  isOver: PropTypes.func,
  canDrop: PropTypes.func,
  connectDragSource: PropTypes.func
};
