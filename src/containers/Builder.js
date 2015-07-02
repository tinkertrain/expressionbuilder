import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

import * as CanvasActions from '../actions/CanvasActions';

import Q from '../components/icons/Q';
import Toolbar from '../components/toolbar/Toolbar';
import Canvas from '../components/Canvas';
import FuseExpression from '../components/FuseExpression';

@connect(state => ({
  canvas: state.canvas
}))
export default class Builder extends Component{
  render() {
    const { dispatch, canvas } = this.props;

    return (
      <div>
        <Q
        id="QLogo"
        color="#191922"
        width="75"
        height="75" />

        <Toolbar />

        <Canvas
        canvas = { canvas }
        {...bindActionCreators(CanvasActions, dispatch)} />

        <FuseExpression canvas = { canvas } />
      </div>
    );
  }
}

Builder.propTypes = {
  dispatch: PropTypes.func,
  canvas: PropTypes.array
};
