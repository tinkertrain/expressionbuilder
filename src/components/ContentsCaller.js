import R from 'ramda';
import { Map } from 'immutable';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Loading from './Loading';

import pureRender from '../utils/pureRender';
import { createContentsQuery } from '../fuselink/queryAPI/queryParameters';

export default class ContentsCaller extends Component {
  componentWillReceiveProps(nextProps) {
    const { fuse } = this.props;
    if (nextProps.fuse !== fuse) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { fuse } = this.props;
    let facets;

    if (fuse.get('expression') !== 'incomplete') {
      facets = R.uniq(
                fuse.get('expression')
                  .split(' ')
                  .filter((str) => str.indexOf(':') !== -1)
                  .map((str) => str.split(':')[0])
                );
    }

    return (
      <div className="Fuse-Response-Contents-Form">
        <form onSubmit={ this.callContentsResponse }>
          <div>
            <label
            htmlFor="limitContents">Limit</label>
            <input
            type="number"
            id="limitContents"
            ref="limitContents"
            onChange = { this.detectChange } />
          </div>

          <div>
            <label
            htmlFor="offsetContents">Offset</label>
            <input
            type="number"
            id="offsetContents"
            ref="offsetContents"
            onChange = { this.detectChange } />
          </div>

          <div>
            <label
            htmlFor="cutContents">Cut</label>
            <input
            type="number"
            id="cutContents"
            ref="cutContents"
            onChange = { this.detectChange } />
          </div>

          <h5>Sort contents by</h5>
          {
            facets.length ?
            facets.map((f, i) => {
              return (
                <div key={`sortby_${i}`}>
                  <label>{f}</label>
                  <select
                  onChange = { this.detectChange }
                  ref={`sortby_${f}`}>
                    <option value="asc">asc</option>
                    <option value="desc">desc</option>
                  </select>
                </div>
              );
            }) :
            null
          }
          <button
          type="submit"
          disabled={this.state.loading && !fuse.get('contents')}
          className = { classNames({
            'FuseDial-Response-Contents-Caller': true
          }) }>
            <span>Get Contents</span>
            {
              this.state.loading ? <Loading /> : null
            }
          </button>
          {
            this.state.sameQuery ? <p style={{
              marginTop: '5px',
              marginBottom: '0',
              textAlign: 'right'
            }}>Query was the same! Results below</p> : null
          }
        </form>
      </div>
    );
  }

  state = {
    loading: false,
    sameQuery: false
  }

  constructor() {
    super();

    this.callContentsResponse = this.callContentsResponse.bind(this);
    this.detectChange = this.detectChange.bind(this);
  }

  detectChange() {
    this.setState({
      sameQuery: false
    });
  }

  callContentsResponse(e) {
    e.preventDefault();
    const { getContents, fuse } = this.props;
    let contentsQParams = fuse.get('contentsQParams') ? fuse.get('contentsQParams').toObject() : {};
    let limitContents = React.findDOMNode(this.refs.limitContents).value;
    let offsetContents = React.findDOMNode(this.refs.offsetContents).value || 0;
    let cutContents = React.findDOMNode(this.refs.cutContents).value || 0;
    let sortContents = parseFacets('sort')(this.refs);
    let contentsQuery = createContentsQuery();
    let contentsQueryObj;

    contentsQuery.q(fuse.get('expression'));

    if (limitContents) {
      contentsQuery.limit(limitContents);
    }

    if (offsetContents > 0) {
      contentsQuery.offset(offsetContents);
    }

    if (cutContents > 0) {
      contentsQuery.cut(cutContents);
    }

    if (sortContents.length) {
      contentsQuery.sortBy(...sortContents);
    }

    contentsQueryObj = contentsQuery.get();

    if (!fuse.get('contents') || !R.equals(contentsQueryObj, contentsQParams)) {
      getContents({
        url: `${fuse.get('endPoint')}${contentsQuery.getURI()}`,
        queryObj: contentsQueryObj
      });

      this.setState({ loading: true });
    }
    if (R.equals(contentsQueryObj, contentsQParams)) {
      this.setState({
        sameQuery: true
      });
    }
  }
}

pureRender(ContentsCaller);

export default ContentsCaller;

function parseFacets(param) {
  return R.compose(
          R.map((f) => {
            return {
              [R.drop(7, f[0])]: React.findDOMNode(f[1]).value || 10
            };
          }),
          R.filter((f) => R.indexOf(param, f[0]) !== -1),
          R.toPairs
  );
}

ContentsCaller.propTypes = {
  getContents: PropTypes.func,
  fuse: PropTypes.instanceOf(Map).isRequired
};
