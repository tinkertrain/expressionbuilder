import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

import * as CanvasActions from '../actions/CanvasActions';

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
