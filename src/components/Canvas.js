import R from 'ramda';
import { Map } from 'immutable';
import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import DnDTypes from '../constants/DnDTypes';
import classNames from 'classnames';
import pureRender from '../utils/pureRender';
import Clause from './expression/Clause';
import Expression from './expression/Expression';

let canvasTarget = {
  drop(props) {
    return props;
  },
  canDrop(props, monitor) {
    let item = monitor.getItem();

    return props.builder.get('canvas').size === 0 && (item.type === 'operator' || item.type === 'clause');
  }
};

@DropTarget(DnDTypes.TOOL, canvasTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class Canvas {
  render() {
    const { builder } = this.props;
    const { connectDropTarget, isOver, canDrop, setClauseOperator, setClauseFacet, setClauseValue, removeExpression } = this.props;
    const canvas = builder.get('canvas');
    let root = canvas.filter((exp) => {
      return exp.get('id') === 0;
    });
    let RootExpression;

    if (root.size > 0) {
      RootExpression = root.map((exp) => {
        if (exp.get('type') === 'clause') {
          return (
            <Clause
            key="1"
            removeExpression = { removeExpression }
            setClauseFacet = { setClauseFacet }
            setClauseOperator = { setClauseOperator }
            setClauseValue = { setClauseValue }
            facetList = { builder.get('fuse').get('facetList') }
            expression = { exp } />
          );
        }
        return (
          <Expression
          id = { exp.get('id') }
          key = { exp.get('id') }
          builder = { builder } />
        );
      });
    }
    else {
      RootExpression = <div className="Canvas--empty">Drop some items!</div>;
    }

    return connectDropTarget(
      <div
      className={classNames({
        Canvas: true,
        'canDrop-isOver': canDrop && isOver,
        'cantDrop-isOver': !canDrop && isOver
      })} >
        { RootExpression }
      </div>
    );
  }
}

pureRender(Canvas);

export default Canvas;

Canvas.propTypes = {
  builder: PropTypes.instanceOf(Map).isRequired,
  isOver: PropTypes.func,
  canDrop: PropTypes.func,
  connectDragSource: PropTypes.func
};
