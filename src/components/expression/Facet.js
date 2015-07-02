import R from 'ramda';
import React, { PropTypes } from 'react';

export default class Facet {
  render() {
    const { expression } = this.props;

    let facet = expression.facet ?
      (
        <div className="Clause-Facet">{ expression.facet }</div>
      ) :
      (
        <form className="Clause-FacetForm" onSubmit={ this.setFacet.bind(this) }>
          <input
          placeholder="Facet"
          ref="facetName"
          onKeyDown={this.setFacetFromTabKey.bind(this)} />
        </form>
      );

    return facet;
  }

  componentDidMount() {
    if (!R.isNil(this.refs.facetName)) {
      this.refs.facetName.getDOMNode().focus();
    }
  }

  setFacetFromTabKey(e) {
    if (e.keyCode == 9) {
      const { expression, setClauseFacet } = this.props;
      let facet = React.findDOMNode(this.refs.facetName).value;

      expression.facet = facet;
      setClauseFacet(expression);
    }
  }

  setFacet(e) {
    e.preventDefault();
    const { expression, setClauseFacet } = this.props;
    let facet = React.findDOMNode(this.refs.facetName).value;

    expression.facet = facet;
    setClauseFacet(expression);
  }
}

Facet.propTypes = {
  expression: PropTypes.object.isRequired
};
