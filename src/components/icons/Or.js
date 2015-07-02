import React, { PropTypes } from 'react';

export default class Or {
  render() {
    const { id, color, width, height } = this.props;

    return (
      <svg
      id={id}
      width={ `${width}px` }
      height={ `${height}px` }
      viewBox="0 0 6 59"
      version="1.1">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <path
              d="M5.568,58.528 L0.768,58.528 L0.768,0.352 L5.568,0.352 L5.568,58.528 Z"
              fill={ color }></path>
          </g>
      </svg>
    );
  }
}

Or.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};
