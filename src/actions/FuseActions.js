import R from 'ramda';
import request from 'superagent-bluebird-promise';
import { SET_FUSE_ENDPOINT, DIAL_FUSE, GET_RESULTS, SAVE_EXPRESSION } from '../constants/ActionTypes';

export function saveExpression(expression) {
  return {
    type: SAVE_EXPRESSION,
    expression
  };
}

export function setFuseEndPoint(url) {
  return (dispatch) => {
    request(url)
    .then((res) => {
      if (R.isNil(res.body.facets)) {
        return dispatch({
          type: SET_FUSE_ENDPOINT,
          url: null
        });
      }
      return dispatch({
        type: SET_FUSE_ENDPOINT,
        url: url
      });
    })
    .catch(() => {
      return dispatch({
        type: SET_FUSE_ENDPOINT,
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
        type: DIAL_FUSE,
        response: R.pick(['facets', 'contents'], res.body)
      });
    })
    .catch(() => {
      return dispatch({
        type: DIAL_FUSE,
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
        type: GET_RESULTS,
        items: R.take(5, res.body.items)
      });
    })
    .catch(() => {
      return dispatch({
        type: GET_RESULTS,
        items: []
      });
    });
  };
}
