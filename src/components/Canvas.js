import R from 'ramda';
import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import DnDTypes from '../constants/DnDTypes';
import classNames from 'classnames';
import Expression from './expression/Expression';

let canvasTarget = {
  drop(props) {
    return props;
  },
  canDrop(props, monitor) {
    let item = monitor.getItem();

    return props.canvas.length === 0 && item.type === 'operator';
  }
};

@DropTarget(DnDTypes.TOOL, canvasTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class Canvas {
  setBGColour() {
    if (this.props.canDrop && this.props.isOver) {
      return 'palegreen';
    }
    if (!this.props.canDrop && this.props.isOver) {
      return 'indianred';
    }
    return 'lightsteelblue';
  }

  render() {
    const { canvas, addExpression } = this.props;
    const { connectDropTarget, isOver, canDrop } = this.props;

    let root = R.filter(R.propEq('id', 0))(canvas);
    let RootExpression;

    if (root) {
      RootExpression = root.map(function createRoot(exp) {
        return (
          <Expression
          id = { exp.id }
          key = { exp.id }
          canvas = { canvas } />
        );
      });
    }
    else {
      RootExpression = 'nada';
    }

    return connectDropTarget(
      <div
      className={classNames({
        Canvas: true,
        'Canvas--canDrop--isOver': this.props.canDrop && this.props.isOver,
        'Canvas--cantDrop--isOver': !this.props.canDrop && this.props.isOver
      })} >
        { RootExpression }
      </div>
    );
  }
}

Canvas.propTypes = {
  canvas: PropTypes.array.isRequired,
  addExpression: PropTypes.func.isRequired,
  isOver: PropTypes.func,
  canDrop: PropTypes.func,
  connectDragSource: PropTypes.func
};
