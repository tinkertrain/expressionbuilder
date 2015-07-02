import React, { PropTypes } from 'react';

export default class Not {
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
              d="M7.504,30.472 L2.704,30.472 L2.064,0.968 L8.016,0.968 L7.504,30.472 Z M5.136,37.192 C6.33067264,37.192 7.34399584,37.6079958 8.176,38.44 C9.00800416,39.2720042 9.424,40.2639942 9.424,41.416 C9.424,42.6106726 9.00800416,43.6239958 8.176,44.456 C7.34399584,45.2880042 6.33067264,45.704 5.136,45.704 C3.94132736,45.704 2.93867072,45.2880042 2.128,44.456 C1.31732928,43.6239958 0.912,42.6106726 0.912,41.416 C0.912,40.2639942 1.31732928,39.2720042 2.128,38.44 C2.93867072,37.6079958 3.94132736,37.192 5.136,37.192 L5.136,37.192 Z"
              fill={ color }></path>
          </g>
      </svg>
    );
  }
}

Not.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};
