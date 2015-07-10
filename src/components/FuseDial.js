import R from 'ramda';
import { Map } from 'immutable';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ItemsRenderer from './ItemsRenderer';

export default class FuseDial extends Component {
  render() {
    const { fuse } = this.props;
    let response = '';
    let items = '';

    if (fuse.get('response')) {
      response = (
        <div className="FuseDial-Response">
          <button
          className = { classNames({
            active: this.state.showing.facets
          }) }
          onClick = {
            this.callResponses.bind(this, 'facets')
          }>Facets</button>

          <button
          className = { classNames({
            active: this.state.showing.contents
          }) }
          onClick = {
            this.callResponses.bind(this, 'contents')
          }>Contents</button>
        </div>
      );
    }

    if (fuse.get('facets') || fuse.get('contents')) {
      items = (
        <div>
          <h3>{ this.state.showing.facets ? 'Facets Response' : 'Contents Response' }</h3>
          <ItemsRenderer items = {
            this.state.showing.facets ?
            JSON.stringify(fuse.get('facets'), null, 2) :
            JSON.stringify(fuse.get('contents'), null, 2) } />
        </div>
        );
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
          <span className="FuseExpression-setEndPoint">Set a valid Fuse URL to see a response made with your expression</span>

        }

        { fuse.get('expression') !== 'incomplete' && fuse.get('endPoint') ? response : null }

        { fuse.get('expression') !== 'incomplete' && fuse.get('endPoint') ? items : null }
      </div>
    );
  }

  state = { showing: { facets: false, contents: false } }

  callFuse() {
    const { fuse, dialFuse } = this.props;
    dialFuse({
      endPoint: fuse.get('endPoint'),
      expression: fuse.get('expression')
    });
  }

  callResponses(type) {
    const { getFacets, getContents, fuse } = this.props;
    if (type === 'facets') {
      this.setState({
        showing: {
          facets: true,
          contents: false
        }
      });
      if (!fuse.get('facets')) {
        getFacets(fuse.get('response').facets);
      }
    }
    else {
      this.setState({
        showing: {
          facets: false,
          contents: true
        }
      });
      if (!fuse.get('contents')) {
        getContents(fuse.get('response').contents);
      }
    }
  }
}

FuseDial.propTypes = {
  getFacets: PropTypes.func,
  getContents: PropTypes.func,
  dialFuse: PropTypes.func,
  fuse: PropTypes.instanceOf(Map).isRequired
};
