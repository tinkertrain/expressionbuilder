import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';
import pureRender from '../utils/pureRender';

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
class Builder extends Component {
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

        <Toolbar
        builder = { builder }
        {...bindActionCreators(BuilderActions, dispatch)} />

        <Canvas
        builder = { builder }
        {...bindActionCreators(BuilderActions, dispatch)} />

        {
          builder.get('fuse').get('facetList') ?
          <div className="AutocompleteNotification">Autocomplete for facets active!</div> : null
        }

        <FuseExpression
        expressionString = { builder.get('fuse').get('expression') } />

        <FuseDial
        fuse = { builder.get('fuse')}
        {...bindActionCreators(BuilderActions, dispatch)} />

        <footer><a tabIndex="-1" href="http://www.qsensei.com/">Q-Sensei</a></footer>

      </div>
    );
  }
}

pureRender(Builder);

export default Builder;

Builder.propTypes = {
  dispatch: PropTypes.func,
  builder: PropTypes.instanceOf(Map)
};
