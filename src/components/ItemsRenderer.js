import React, { PropTypes } from 'react';
import { List } from 'immutable';
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
          { JSON.stringify(items, null, 2) }
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
  items: PropTypes.instanceOf(List).isRequired
};
