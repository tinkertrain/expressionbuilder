import R from 'ramda';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default class FuseDial {
  render() {
    const { fuse } = this.props;
    let response = '';
    let items = '';

    if (!R.isNil(fuse.response)) {
      response = (
        <div className="FuseDial-Response">
          <button onClick = { this.callResponses.bind(this, fuse.response.facets) }>Facets</button>
          <button onClick = { this.callResponses.bind(this, fuse.response.contents) }>Contents</button>
        </div>
      );
    }

    if (!R.isNil(fuse.items)) {
      items = <pre className="FuseDial-Items">{ JSON.stringify(fuse.items, null, 2) }</pre>;
    }

    return (
      <div>
        <button
        className = {
          classNames({
            'FuseDial-Caller': true,
            'FuseDial-Caller--clicked': !R.isNil(fuse.response)
          })
        }
        onClick={ this.callFuse.bind(this) }>Call Fuse</button>

        { response }

        { items }
      </div>
    );
  }

  callFuse() {
    const { fuse, expression, dialFuse } = this.props;
    dialFuse({
      endPoint: fuse.endPoint,
      expression
    });
  }

  callResponses(url) {
    const { getResults } = this.props;
    getResults(url);
  }
}

FuseDial.propTypes = {
  getResults: PropTypes.func,
  dialFuse: PropTypes.func,
  fuse: PropTypes.object.isRequired,
  expression: PropTypes.string.isRequired
};
