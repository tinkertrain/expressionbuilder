import R from 'ramda';
import { Map } from 'immutable';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import pureRender from '../utils/pureRender';
import ItemsRenderer from './ItemsRenderer';

class FuseDial extends Component {
  render() {
    const { fuse } = this.props;
    let response = '';
    let items = '';

    if (fuse.get('response')) {
      response = (
        <div className="FuseDial-Response">
          <button
          disabled = { this.state.showing.facets }
          className = { classNames({
            active: this.state.showing.facets && fuse.get('facets')
          }) }
          onClick = {
            this.callResponses.bind(this, 'facets')
          }>Facets</button>

          <button
          disabled = { this.state.showing.contents }
          className = { classNames({
            active: this.state.showing.contents && fuse.get('contents')
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
            disabled = { !!fuse.get('response') }
            className = {
              classNames({
               'FuseDial-Caller': true,
               'FuseDial-Caller--clicked': !R.isNil(fuse.get('response'))
              })
            }
            onClick={ this.callFuse.bind(this) }>
               { !!fuse.get('response') ? 'Fuse Called' : 'Call Fuse' }
             </button>
            ) :
          <span className="FuseExpression-setEndPoint">Set a valid Fuse URL and build an expression to see a response made with it</span>

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

pureRender(FuseDial);

export default FuseDial;

FuseDial.propTypes = {
  getFacets: PropTypes.func,
  getContents: PropTypes.func,
  dialFuse: PropTypes.func,
  fuse: PropTypes.instanceOf(Map).isRequired
};
