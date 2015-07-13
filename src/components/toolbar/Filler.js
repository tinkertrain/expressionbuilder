import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import pureRender from '../../utils/pureRender';
import { isCanvasComplete, expressionsAreComplete } from '../../utils/canvasUtils';

class Filler {
  render() {
    const { builder } = this.props;
    const canvas = builder.get('canvas');
    let disable = this.disableButton(canvas);

    return (
      <button className="Filler"
      disabled = { disable }
      onClick = { this.handleClick.bind(this) }>Clause it!</button>
    );
  }

  handleClick() {
    const { fillEmpty, builder } = this.props;
    const canvas = builder.get('canvas');

    fillEmpty(canvas);
  }

  disableButton(canvas) {
    let complete = isCanvasComplete(canvas);
    let empty = !!canvas.size;
    let isRootAClause = canvas.size && canvas.find((exp) => exp.get('id') === 0).get('type') === 'clause';
    let expressionsComplete = expressionsAreComplete(canvas);

    return complete || !empty || isRootAClause || expressionsComplete;
  }
}

pureRender(Filler);

export default Filler;

Filler.propTypes = {
  fillEmpty: PropTypes.func.isRequired,
  builder: PropTypes.instanceOf(Map)
};
