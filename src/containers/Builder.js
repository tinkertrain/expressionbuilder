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
  builder: state.builder
}))
export default class Builder extends Component{
  render() {
    const { dispatch, builder } = this.props;

    return (
      <div>
        <Q
        id="QLogo"
        color="#191922"
        width="75"
        height="75" />

        <Toolbar />

        <Canvas
        builder = { builder }
        {...bindActionCreators(CanvasActions, dispatch)} />
      </div>
    );
    // return (
    //   <div>
    //     <Q
    //     id="QLogo"
    //     color="#191922"
    //     width="75"
    //     height="75" />

    //     <FuseEndPoint
    //     fuse = { fuse }
    //     {...bindActionCreators(FuseActions, dispatch)} />


    //     <Canvas
    //     canvas = { canvas }
    //     {...bindActionCreators(CanvasActions, dispatch)} />

    //     <FuseExpression
    //     canvas = { canvas }
    //     fuse = { fuse }
    //     {...bindActionCreators(FuseActions, dispatch)} />

    //   </div>
    // );
  }
}

Builder.propTypes = {
  dispatch: PropTypes.func,
  builder: PropTypes.object
};
