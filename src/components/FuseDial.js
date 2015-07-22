import { Map } from 'immutable';
import React, { PropTypes } from 'react';

import pureRender from '../utils/pureRender';

import FacetsCaller from './FacetsCaller';
import ContentsCaller from './ContentsCaller';
import ItemsRenderer from './ItemsRenderer';

class FuseDial {
  render() {
    const { fuse, getFacets, getContents } = this.props;

    return (
      <div className="FuseDial">
        {
          fuse.get('expression') !== 'incomplete' ?
          (
            <div>
              <div>
                <h3>Configure the request</h3>
                <FacetsCaller fuse = { fuse } getFacets = { getFacets }/>
                <ContentsCaller fuse = { fuse } getContents = { getContents }/>
              </div>
            </div>
          ) :
          <span className="FuseExpression-setEndPoint">Set a valid Fuse URL and build an expression to see a response made with it</span>
        }
        {
          fuse.get('facets') ?
          (
            <div>
              <h3>Facets Response</h3>
              <ItemsRenderer items = { fuse.get('facets') } />
            </div>
          ) : null
        }
        {
          fuse.get('contents') ?
          (
            <div>
              <h3>Contents Response</h3>
              <ItemsRenderer items = { fuse.get('contents') } />
            </div>
          ) : null
        }
      </div>
    );
  }
}

pureRender(FuseDial);

export default FuseDial;

FuseDial.propTypes = {
  getFacets: PropTypes.func,
  getContents: PropTypes.func,
  fuse: PropTypes.instanceOf(Map).isRequired
};
