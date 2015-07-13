import React, { PropTypes } from 'react';
import Prism from 'prismjs';
import pureRender from '../utils/pureRender';
import '../../node_modules/prismjs-okaidia-theme/prism-okaidia.css';

class ItemsRenderer {
  componentDidMount() {
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

  componentDidUpdate() {
    Prism.highlightElement(React.findDOMNode(this.refs.items));
  }
}

pureRender(ItemsRenderer);

export default ItemsRenderer;

ItemsRenderer.propTypes = {
  items: PropTypes.string.isRequired
};
