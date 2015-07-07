import R from 'ramda';
import { SET_FUSE_ENDPOINT, DIAL_FUSE, GET_RESULTS, SAVE_EXPRESSION } from '../constants/ActionTypes';

export default function fuse(state = {}, action) {
  switch (action.type) {
    case SET_FUSE_ENDPOINT:
      let newState = R.clone(state);
      if (action.url === 'invalid') {
        newState.endPoint = null;
      }
      newState.endPoint = action.url;
      newState.items = null;
      newState.response = null;

      return newState;

    case DIAL_FUSE:
      let stateWithResponse = R.clone(state);
      stateWithResponse.response = action.response;

      return stateWithResponse;

    case GET_RESULTS:
      let stateWithItems = R.clone(state);
      stateWithItems.items = action.items;

      return stateWithItems;

    case SAVE_EXPRESSION:
      let stateWithExpression = R.clone(state);
      stateWithExpression.expression = action.expression;

      return stateWithExpression;

    default:
      return state;
  }
}
