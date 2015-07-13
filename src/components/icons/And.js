import React, { PropTypes } from 'react';
import pureRender from '../../utils/pureRender';

class And {
  render() {
    const { id, color, width, height } = this.props;

    return (
      <svg
      id={id}
      width={ `${width}px` }
      height={ `${height}px` }
      viewBox="0 0 36 46"
      version="1.1">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M14.856,0.264 C16.7333427,0.264 18.5466579,0.5839968 20.296,1.224 C22.0453421,1.8640032 23.7946579,3.1439904 25.544,5.064 L22.344,7.944 C21.2346611,6.74932736 20.0933392,5.84266976 18.92,5.224 C17.7466608,4.60533024 16.3706746,4.296 14.792,4.296 C12.5306554,4.296 10.8346723,4.90399392 9.704,6.12 C8.57332768,7.33600608 8.008,8.9039904 8.008,10.824 C8.008,12.7866765 8.77599232,14.5039926 10.312,15.976 C11.8480077,17.4480074 13.7039891,18.184 15.88,18.184 L33.672,18.184 L33.672,22.344 L27.976,22.344 L27.976,39.816 C27.0373286,41.0106726 25.5120106,42.2906598 23.4,43.656 C21.2879894,45.0213402 18.3760186,45.704 14.664,45.704 C12.189321,45.704 10.056009,45.3200038 8.264,44.552 C6.47199104,43.7839962 5.00000576,42.7920061 3.848,41.576 C2.69599424,40.3599939 1.84266944,38.952008 1.288,37.352 C0.73333056,35.751992 0.456,34.1413414 0.456,32.52 C0.456,29.2346502 1.33065792,26.5360106 3.08,24.424 C4.82934208,22.3119894 7.303984,20.9146701 10.504,20.232 L10.504,20.04 C7.60265216,19.3573299 5.58667232,18.1413421 4.456,16.392 C3.32532768,14.6426579 2.76,12.7866765 2.76,10.824 C2.76,8.00798592 3.84798912,5.54401056 6.024,3.432 C8.20001088,1.31998944 11.1439814,0.264 14.856,0.264 L14.856,0.264 Z M15.112,22.344 C13.4479917,22.344 12.0186726,22.6533302 10.824,23.272 C9.62932736,23.8906698 8.64800384,24.6799952 7.88,25.64 C7.11199616,26.6000048 6.54666848,27.6773274 6.184,28.872 C5.82133152,30.0666726 5.64,31.2186611 5.64,32.328 C5.64,34.6320115 6.36532608,36.7226573 7.816,38.6 C9.26667392,40.4773427 11.6133171,41.416 14.856,41.416 C16.6053421,41.416 18.2053261,41.1173363 19.656,40.52 C21.1066739,39.9226637 22.2586624,39.090672 23.112,38.024 L23.112,22.344 L15.112,22.344 Z"
              fill={ color }></path>
          </g>
      </svg>
    );
  }
}

pureRender(And);

export default And;

And.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};
