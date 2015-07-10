import React, { PropTypes } from 'react';
import Prism from 'prismjs';
require('../../node_modules/prismjs-okaidia-theme/prism-okaidia.css');

export default class ItemsRenderer {
  componentDidMount() {
    Prism.highlightElement(React.findDOMNode(this.refs.items));
  }

  componentDidUpdate() {
    Prism.highlightElement(React.findDOMNode(this.refs.items));
  }

  render() {
    const { items } = this.props;

    return (
      <pre className="FuseDial-Items">
        <code className="language-javascript" ref="items">
          { items }
        </code>
      </pre>
    );
  }
}


ItemsRenderer.propTypes = {
  items: PropTypes.string.isRequired
};
