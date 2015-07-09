import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

import * as BuilderActions from '../actions/BuilderActions';

import Q from '../components/icons/Q';
import Toolbar from '../components/toolbar/Toolbar';
import Canvas from '../components/Canvas';
import FuseExpression from '../components/FuseExpression';
import FuseEndPoint from '../components/FuseEndPoint';
import FuseDial from '../components/FuseDial';

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

        <FuseEndPoint
        fuse = { builder.get('fuse') }
        {...bindActionCreators(BuilderActions, dispatch)} />

        <Toolbar />

        <Canvas
        builder = { builder }
        {...bindActionCreators(BuilderActions, dispatch)} />

        <FuseExpression
        expressionString = { builder.get('fuse').get('expression') } />

        <FuseDial
        fuse = { builder.get('fuse')}
        {...bindActionCreators(BuilderActions, dispatch)} />

      </div>
    );
  }
}

Builder.propTypes = {
  dispatch: PropTypes.func,
  builder: PropTypes.object
};
