import R from 'ramda';
import { Map } from 'immutable';
import React, { Component, PropTypes } from 'react';

export default class FuseEndPoint extends Component {
  render() {
    const { fuse } = this.props;
    let endPoint = fuse.get('endPoint') && !this.state.editMode ?
      (
        <div className="FuseEndPoint">
          <h3>Fuse URL</h3>
          <span onClick = {this.editEndpoint.bind(this)}>{ fuse.get('endPoint') }</span>
        </div>
      ) :
      (
        <div className="FuseEndPoint">
          <form onSubmit = { this.handleSubmit.bind(this) }>
            <label htmlFor="endpoint">Fuse URL</label>
            <input
            type="text"
            id="endpoint"
            ref="endpoint"
            defaultValue={ fuse.get('endPoint') || ''}
            placeholder="http://0.0.0.0"/>
          </form>
        </div>
      );

    return endPoint;
  }

  state = { editMode: true }

  componentDidMount() {
    if (!R.isNil(this.refs.endpoint)) {
      this.refs.endpoint.getDOMNode().focus();
    }
  }

  componentDidUpdate() {
    if (!R.isNil(this.refs.endpoint)) {
      this.refs.endpoint.getDOMNode().select();
      this.refs.endpoint.getDOMNode().focus();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { setFuseEndPoint, fuse } = this.props;
    let endpoint = React.findDOMNode(this.refs.endpoint).value;

    if (fuse.get('endPoint') || fuse.get('endPoint') !== endpoint) {
      setFuseEndPoint(endpoint);
    }

    this.setState({ editMode: false });
  }

  editEndpoint() {
    this.setState({ editMode: true });
  }
}

FuseEndPoint.propTypes = {
  fuse: PropTypes.instanceOf(Map).isRequired,
  setFuseEndPoint: PropTypes.func
};
