import R from 'ramda';
import { Map } from 'immutable';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default class FuseDial {
  render() {
    const { fuse } = this.props;
    let response = '';
    let items = '';

    if (fuse.get('response')) {
      response = (
        <div className="FuseDial-Response">
          <button
          onClick = {
            this.callResponses.bind(this, fuse.get('response').facets)
          }>
            Facets
          </button>
          <button
          onClick = {
            this.callResponses.bind(this, fuse.get('response').contents)
          }>
            Contents
          </button>
        </div>
      );
    }

    if (fuse.get('items')) {
      items = <pre className="FuseDial-Items">{ JSON.stringify(fuse.get('items'), null, 2) }</pre>;
    }

    return (
      <div className="FuseDial">
        {
          fuse.get('expression') !== 'incomplete' && fuse.get('endPoint') ?
          (
            <button
             className = {
               classNames({
                 'FuseDial-Caller': true,
                 'FuseDial-Caller--clicked': !R.isNil(fuse.get('response'))
               })
             }
             onClick={ this.callFuse.bind(this) }>
               Call Fuse
             </button>
            ) :
          <span className="FuseExpression-setEndPoint">Set a Fuse URL to see a response made with your expression</span>

        }

        { fuse.get('expression') !== 'incomplete' && fuse.get('endPoint') ? response : null }

        { fuse.get('expression') !== 'incomplete' && fuse.get('endPoint') ? items : null }
      </div>
    );
  }

  callFuse() {
    const { fuse, dialFuse } = this.props;
    dialFuse({
      endPoint: fuse.get('endPoint'),
      expression: fuse.get('expression')
    });
  }

  callResponses(url) {
    const { getResults } = this.props;
    getResults(url);
  }
}

FuseDial.propTypes = {
  getResults: PropTypes.func,
  dialFuse: PropTypes.func,
  fuse: PropTypes.instanceOf(Map).isRequired
};
