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
  return (dispatch) => {
    request(url)
    .then((res) => {
      if (res.body.facets) {
        return dispatch({
          type: aT.SET_FUSE_ENDPOINT,
          url: url
        });
      }
      return dispatch({
        type: aT.SET_FUSE_ENDPOINT,
        url: null
      });
    })
    .catch(() => {
      return dispatch({
        type: aT.SET_FUSE_ENDPOINT,
        url: null
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

export function getResults(url) {
  return (dispatch) => {
    request(url)
    .then((res) => {
      return dispatch({
        type: aT.GET_RESULTS,
        items: R.take(5, res.body.items)
      });
    })
    .catch(() => {
      return dispatch({
        type: aT.GET_RESULTS,
        items: []
      });
    });
  };
}
