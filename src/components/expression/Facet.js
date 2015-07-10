import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';

export default class Facet extends Component {
  render() {
    const { expression } = this.props;

    let facet = expression.get('facet') && !this.state.editMode ?
      (
        <div
        className="Clause-Facet"
        onClick={this.editFacet.bind(this)}>
          { expression.get('facet') }
        </div>
      ) :
      (
        <form className="Clause-FacetForm" onSubmit={ this.setFacet.bind(this) }>
          <input
          placeholder="Facet"
          ref="facetName"
          defaultValue={ expression.get('facet') || ''}
          onKeyDown={this.setFacetFromTabKey.bind(this)} />
        </form>
      );

    return facet;
  }

  state = { editMode: true }

  componentDidMount() {
    if (this.refs.facetName) {
      React.findDOMNode(this.refs.facetName).focus();
    }
  }

  componentDidUpdate() {
    if (this.refs.facetName) {
      React.findDOMNode(this.refs.facetName).select();
      React.findDOMNode(this.refs.facetName).focus();
    }
  }

  setFacetFromTabKey(e) {
    if (e.keyCode === 9 || e.keyCode === '9') {
      const { expression, setClauseFacet } = this.props;
      let facet = React.findDOMNode(this.refs.facetName).value;

      setClauseFacet(expression.set('facet', facet));

      this.setState({ editMode: false});
    }
  }

  setFacet(e) {
    e.preventDefault();
    const { expression, setClauseFacet } = this.props;
    let facet = React.findDOMNode(this.refs.facetName).value;

    setClauseFacet(expression.set('facet', facet));

    this.setState({ editMode: false});
  }

  editFacet() {
    this.setState({ editMode: true});
  }
}

Facet.propTypes = {
  expression: PropTypes.instanceOf(Map).isRequired
};
