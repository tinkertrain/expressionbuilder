import R from 'ramda';
import request from 'superagent-bluebird-promise';
import * as aT from '../constants/ActionTypes';

export function addExpression(expression) {
  return {
    type: aT.ADD_EXPRESSION,
    expression
  };
}

export function removeExpression(expression) {
  return {
    type: aT.REMOVE_EXPRESSION,
    expression
  };
}

export function changeExpressionOperator(expression) {
  return {
    type: aT.CHANGE_EXPRESSION_OPERATOR,
    expression
  };
}

export function fillEmpty(canvas) {
  return {
    type: aT.FILL_EMPTY,
    canvas
  };
}

export function setClauseFacet(expression) {
  return {
    type: aT.SET_CLAUSE_FACET,
    expression
  };
}

export function setClauseValue(expression) {
  return {
    type: aT.SET_CLAUSE_VALUE,
    expression
  };
}

export function setClauseOperator(expression) {
  return {
    type: aT.SET_CLAUSE_OPERATOR,
    expression
  };
}

export function setFuseEndPoint(url) {
  let fuseUrl = url.match(/\/$/) ? url : `${url}/`;
  return (dispatch) => {
    request(`${fuseUrl}facets`)
    .then((res) => {
      if (res.body) {
        return dispatch({
          type: aT.SET_FUSE_ENDPOINT,
          response: {
            url: fuseUrl,
            facetList: R.pluck('name', res.body.items)
          }
        });
      }
      return dispatch({
        type: aT.SET_FUSE_ENDPOINT,
        response: {
          url: null,
          facetList: null
        }
      });
    })
    .catch(() => {
      return dispatch({
        type: aT.SET_FUSE_ENDPOINT,
        response: {
          url: null,
          facetList: null
        }
      });
    });
  };
}
export function dialFuse(params) {
  let query = {
    q: params.expression
  };
  return (dispatch) => {
    request(`${params.endPoint}queries`)
    .query(query)
    .then((res) => {
      return dispatch({
        type: aT.DIAL_FUSE,
        response: R.pick(['facets', 'contents'], res.body)
      });
    })
    .catch(() => {
      return dispatch({
        type: aT.DIAL_FUSE,
        response: null
      });
    });
  };
}

export function getFacets(params) {
  return (dispatch) => {
    request(params.url)
    .then((res) => {
      return dispatch({
        type: aT.GET_FACETS,
        payload: {
          items: res.body.items,
          qParams: params.queryObj
        }
      });
    })
    .catch(() => {
      return dispatch({
        type: aT.GET_FACETS,
        payload: {
          items: [],
          qParams: params.queryObj
        }
      });
    });
  };
}

export function getContents(params) {
  return (dispatch) => {
    request(params.url)
    .then((res) => {
      return dispatch({
        type: aT.GET_CONTENTS,
        payload: {
          items: res.body.items,
          qParams: params.queryObj
        }
      });
    })
    .catch(() => {
      return dispatch({
        type: aT.GET_CONTENTS,
        payload: {
          items: [],
          qParams: params.queryObj
        }
      });
    });
  };
}

