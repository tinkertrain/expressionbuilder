import React, { PropTypes } from 'react';
import pureRender from '../../utils/pureRender';

class Or {
  render() {
    const { id, color, width, height } = this.props;

    return (
      <svg
      id={id}
      width={ `${width}px` }
      height={ `${height}px` }
      viewBox="0 0 6 59"
      version="1.1">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path
              d="M5.568,58.528 L0.768,58.528 L0.768,0.352 L5.568,0.352 L5.568,58.528 Z"
              fill={ color }></path>
          </g>
      </svg>
    );
  }
}

pureRender(Or);

export default Or;

Or.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};
