import React, { PropTypes } from 'react';
import pureRender from '../../utils/pureRender';

class Gear {
  render() {
    const { id, color, width, height } = this.props;

    return (
      <svg
      id={id}
      width={ `${width}px` }
      height={ `${height}px` }
      viewBox="0 0 512 512"
      version="1.1">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M333.813,247.681v-38.223l-20.652-7.344c-7.875-2.799-14.211-8.814-17.41-16.535

  c-0.002-0.002-0.004-0.006-0.004-0.01c-3.211-7.738-2.986-16.475,0.609-24.041l9.408-19.788l-27.029-27.027l-19.783,9.404

  c-7.562,3.596-16.312,3.822-24.047,0.615c-0.004-0.004-0.008-0.004-0.01-0.004c-7.727-3.203-13.73-9.531-16.533-17.412

  l-7.344-20.654h-38.223l-7.346,20.654c-2.801,7.873-8.812,14.211-16.532,17.412c-0.002,0-0.006,0.002-0.01,0.004

  c-7.74,3.209-16.477,2.984-24.045-0.613l-19.785-9.406L78.049,141.74l9.406,19.784c3.596,7.562,3.82,16.312,0.613,24.049

  c-0.002,0.002-0.002,0.004-0.006,0.01c-3.201,7.723-9.529,13.729-17.408,16.531L50,209.458v38.223l20.654,7.344

  c7.873,2.801,14.209,8.814,17.41,16.533c0.002,0.004,0.002,0.008,0.004,0.01c3.209,7.74,2.984,16.477-0.611,24.045l-9.408,19.787

  l27.029,27.025l19.785-9.402c7.562-3.596,16.312-3.82,24.049-0.613c0.002,0.002,0.006,0.004,0.008,0.004

  c7.724,3.203,13.728,9.527,16.53,17.408l7.346,20.653h38.223l7.299-20.521c2.824-7.947,8.891-14.344,16.678-17.582

  c0.004-0.002,0.008-0.002,0.012-0.004c7.666-3.189,16.32-2.969,23.818,0.594l19.91,9.463l27.029-27.025l-9.412-19.799

  c-3.592-7.555-3.814-16.295-0.609-24.023c0.002-0.004,0.004-0.006,0.004-0.01c3.207-7.732,9.539-13.742,17.426-16.547

  L333.813,247.681z M191.907,280.61c-28.742,0-52.042-23.301-52.042-52.041c0-28.742,23.3-52.043,52.042-52.043

  c28.74,0,52.041,23.301,52.041,52.043C243.948,257.31,220.647,280.61,191.907,280.61z M462,360.06v-20.32l-10.979-3.902

  c-4.188-1.488-7.557-4.688-9.258-8.791c-0.002,0-0.002-0.002-0.002-0.004c-1.707-4.115-1.586-8.76,0.326-12.783l5-10.52

  l-14.369-14.367l-10.518,5c-4.02,1.91-8.67,2.031-12.783,0.326c-0.002,0-0.004,0-0.006,0c-4.105-1.705-7.299-5.068-8.787-9.258

  l-3.904-10.98H376.4l-3.904,10.98c-1.49,4.186-4.686,7.555-8.789,9.258c-0.002,0-0.004,0-0.006,0

  c-4.112,1.705-8.757,1.586-12.78-0.326l-10.52-5l-14.369,14.367l5.002,10.52c1.91,4.02,2.029,8.672,0.324,12.783

  c0,0.002,0,0.004-0.002,0.006c-1.701,4.107-5.066,7.299-9.254,8.789l-10.98,3.902v20.32l10.98,3.903

  c4.186,1.488,7.555,4.684,9.254,8.789c0.002,0.002,0.002,0.004,0.002,0.006c1.707,4.113,1.588,8.758-0.324,12.781l-5.002,10.52

  l14.369,14.367l10.52-4.998c4.02-1.912,8.67-2.031,12.782-0.326c0.002,0,0.002,0.002,0.004,0.002

  c4.107,1.701,7.297,5.064,8.789,9.252l3.904,10.982h20.32l3.879-10.91c1.502-4.225,4.727-7.625,8.867-9.348

  c0.002,0,0.004-0.002,0.006-0.002c4.074-1.695,8.676-1.578,12.662,0.316l10.584,5.031l14.369-14.367l-5.002-10.525

  c-1.91-4.018-2.029-8.664-0.326-12.771c0-0.002,0.002-0.004,0.002-0.004c1.707-4.111,5.072-7.307,9.264-8.799L462,360.06z

   M386.561,377.564c-15.279,0-27.665-12.387-27.665-27.665c0-15.279,12.386-27.666,27.665-27.666s27.666,12.387,27.666,27.666

  C414.227,365.178,401.84,377.564,386.561,377.564z"
              fill={ color }></path>
          </g>
      </svg>
    );
  }
}

pureRender(Gear);

export default Gear;

Gear.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};