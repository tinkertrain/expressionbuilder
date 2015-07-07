import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

import * as CanvasActions from '../actions/CanvasActions';
import * as FuseActions from '../actions/FuseActions';

import Q from '../components/icons/Q';
import Toolbar from '../components/toolbar/Toolbar';
import Canvas from '../components/Canvas';
import FuseExpression from '../components/FuseExpression';
import FuseEndPoint from '../components/FuseEndPoint';

@connect(state => ({
  canvas: state.canvas,
  fuse: state.fuse
}))
export default class Builder extends Component{
  render() {
    const { dispatch, canvas, fuse } = this.props;

    return (
      <div>
        <Q
        id="QLogo"
        color="#191922"
        width="75"
        height="75" />

        <FuseEndPoint
        fuse = { fuse }
        {...bindActionCreators(FuseActions, dispatch)} />

        <Toolbar />

        <Canvas
        canvas = { canvas }
        {...bindActionCreators(CanvasActions, dispatch)} />

        <FuseExpression
        canvas = { canvas }
        fuse = { fuse }
        {...bindActionCreators(FuseActions, dispatch)} />

      </div>
    );
  }
}

Builder.propTypes = {
  dispatch: PropTypes.func,
  canvas: PropTypes.array,
  fuse: PropTypes.object
};
