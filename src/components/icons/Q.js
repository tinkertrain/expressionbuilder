import React, { PropTypes } from 'react';

export default class Q {
  render() {
    const { id, color, width, height } = this.props;

    return (
      <svg
      id={id}
      width={ `${width}px` }
      height={ `${height}px` }
      viewBox="0 0 100 100"
      version="1.1">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M66.3257,52.2988L51.2667,52.2988L73.9627,74.9898L89.0257,74.9898L77.3257,63.2928C80.9707,58.2758 83.1327,52.1068 83.1327,45.4248C83.1327,28.6128 69.5057,14.9858 52.6937,14.9858C35.8807,14.9858 22.2527,28.6128 22.2527,45.4248C22.2527,62.2368 35.8807,75.8618 52.6937,75.8658C55.3337,75.8658 57.8957,75.5278 60.3377,74.8968L60.3377,62.9708C57.9927,63.9908 55.4087,64.5648 52.6937,64.5648C42.1407,64.5648 33.5517,55.9808 33.5517,45.4248C33.5517,34.8708 42.1407,26.2838 52.6937,26.2838C63.2477,26.2838 71.8327,34.8708 71.8327,45.4248C71.8327,48.9728 70.8647,52.2928 69.1717,55.1458L66.3257,52.2988Z"
              fill={ color }></path>
          </g>
      </svg>
    );
  }
}

Q.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};
