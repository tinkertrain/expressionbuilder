import R from 'ramda';
import { Map } from 'immutable';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Awesomplete from 'awesomplete';

import pureRender from '../utils/pureRender';
import { createFacetsQuery } from 'queryapi/queryParameters';

export default class FacetsCaller extends Component {
  componentDidMount() {
    const { fuse } = this.props;
    let facetList = fuse.get('facetList');
    if (fuse.get('expression') !== 'incomplete') {
      let exp = fuse.get('expression')
                .split(' ')
                .filter((str) => str.indexOf(':') !== -1)
                .map((str) => str.split(':')[0]);
      let cleanedFacetList = R.reject((facet) => R.contains(facet, exp), facetList);

      if (this.refs.returnFacets) {
        let input = React.findDOMNode(this.refs.returnFacets);

        if (facetList && facetList.length) {
          /* eslint-disable no-unused-vars */
          let awesomplete = new Awesomplete(input, {
            list: cleanedFacetList,

            filter(text, inp) {
              return Awesomplete.FILTER_CONTAINS(text, inp.match(/[^,]*$/)[0]);
            },

            replace(text) {
              let before = this.input.value.match(/^.+,\s*|/)[0];
              this.input.value = before + text + ',';
            },

            autoFirst: true
          });
          /* eslint-enable no-unused-vars */
          document.addEventListener('awesomplete-selectcomplete', (e) => {
            if (e.target.id === 'returnFacets') {
              this.checkReturnFacets();
            }
          });
        }
      }
    }
  }

  render() {
    return (
      <div className="Fuse-Response-Facets-Form">
        <form onSubmit={ this.callFacetsResponse }>
          <div>
            <label
            style = {{display: 'block', width: '100%'}}
            htmlFor="returnFacets">Return Facets</label>
            <p>The facets you are interested in being returned. Leave empty to return all.</p>
            <input
            type="text"
            id="returnFacets"
            ref="returnFacets"
            onBlur = { this.checkReturnFacets }/>
          </div>
          {
            this.state.typedFacets.length ?
            <h5>Limit facet results</h5> :
            null
          }
          {
            this.state.typedFacets.length ?
            this.state.typedFacets.map((f, i) => {
              return (
                <div key={`limit_${i}`}>
                  <label>{f}</label>
                  <input
                  type="number"
                  ref={`limit_${f}`}/>
                </div>
              );
            }) :
            null
          }
          {
            this.state.typedFacets.length ?
            <h5>Sort facet results</h5> :
            null
          }
          {
            this.state.typedFacets.length ?
            this.state.typedFacets.map((f, i) => {
              return (
                <div key={`sort__${i}`}>
                  <label>{f}</label>
                  <select
                  ref={`sort__${f}`}>
                    <option value="freq">freq</option>
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
          className = { classNames({
            'FuseDial-Response-Facets-Caller': true
          }) }>Get Facets</button>
        </form>
      </div>
    );
  }

  state = {
    typedFacets: []
  }

  constructor() {
    super();

    this.checkReturnFacets = this.checkReturnFacets.bind(this);
    this.callFacetsResponse = this.callFacetsResponse.bind(this);
  }

  checkReturnFacets() {
    let returnFacets = React.findDOMNode(this.refs.returnFacets).value;

    this.setState({
      typedFacets: R.filter((f) => !!f, R.split(',', returnFacets))
    });
  }

  callFacetsResponse(e) {
    e.preventDefault();
    const { getFacets, fuse } = this.props;
    let facetQuery = createFacetsQuery();
    let facetQueryObj;
    let returnFacets = React.findDOMNode(this.refs.returnFacets).value;
    let limitFacets = parseTypedFacets('limit')(this.refs);
    let sortFacets = parseTypedFacets('sort')(this.refs);
    let facetsQParams = fuse.get('facetsQParams') ? fuse.get('facetsQParams').toObject() : {};

    if (returnFacets) {
      facetQuery.facets(R.filter((f) => !!f, R.split(',', returnFacets)));
    }
    if (limitFacets.length) {
      facetQuery.fLimit.apply(facetQuery, limitFacets);
    }
    if (sortFacets.length) {
      facetQuery.fSort.apply(facetQuery, sortFacets);
    }

    facetQuery.q(fuse.get('expression'));

    facetQueryObj = facetQuery.get();

    if (!fuse.get('facets') || !R.equals(facetQueryObj, facetsQParams)) {
      getFacets({
        url: `${fuse.get('endPoint')}${facetQuery.getURI()}`,
        queryObj: facetQueryObj
      });
    }
  }
}

pureRender(FacetsCaller);

export default FacetsCaller;

function parseTypedFacets(param) {
  return R.compose(
          R.map((f) => {
            return {
              [R.drop(6, f[0])]: React.findDOMNode(f[1]).value || 10
            };
          }),
          R.filter((f) => R.indexOf(param, f[0]) !== -1),
          R.toPairs
  );
}

FacetsCaller.propTypes = {
  getFacets: PropTypes.func,
  fuse: PropTypes.instanceOf(Map).isRequired
};