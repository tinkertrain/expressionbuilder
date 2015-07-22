import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import Awesomplete from 'awesomplete';
import '../../../node_modules/awesomplete/awesomplete.css';
import pureRender from '../../utils/pureRender';

class Facet extends Component {
  render() {
    const { expression, facetList } = this.props;

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
    const { expression, facetList, setClauseFacet } = this.props;

    if (this.refs.facetName) {
      let input = React.findDOMNode(this.refs.facetName);

      if (facetList && facetList.length) {
        /* eslint-disable no-unused-vars */
        let awesomplete = new Awesomplete(input, {
          list: facetList,
          autoFirst: true
        });
        /* eslint-enable no-unused-vars */

        input.addEventListener('awesomplete-selectcomplete', (e) => {
          setClauseFacet(expression.set('facet', e.target.value));
          this.setState({ editMode: false });
        });
      }

      input.select();
      input.focus();
    }
  }

  componentDidUpdate() {
    const { expression, facetList, setClauseFacet } = this.props;

    if (this.refs.facetName) {
      let input = React.findDOMNode(this.refs.facetName);

      if (facetList && facetList.length) {
        /* eslint-disable no-unused-vars */
        let awesomplete = new Awesomplete(input, {
          list: facetList,
          autoFirst: true
        });
        /* eslint-enable no-unused-vars */

        input.addEventListener('awesomplete-selectcomplete', (e) => {
          setClauseFacet(expression.set('facet', e.target.value));
          this.setState({ editMode: false });
        });
      }

      input.select();
      input.focus();
    }
  }

  setFacetFromTabKey(e) {
    if (e.keyCode === 9 || e.keyCode === '9') {
      const { expression, setClauseFacet } = this.props;
      let facet = React.findDOMNode(this.refs.facetName).value;

      if (facet) {
        setClauseFacet(expression.set('facet', facet));
        this.setState({ editMode: false });
      }
    }
  }

  setFacet(e) {
    e.preventDefault();
    const { expression, setClauseFacet } = this.props;
    let facet = React.findDOMNode(this.refs.facetName).value;

    if (facet) {
      setClauseFacet(expression.set('facet', facet));
      this.setState({ editMode: false });
    }
  }

  editFacet() {
    this.setState({ editMode: true});
  }
}

pureRender(Facet);

export default Facet;

Facet.propTypes = {
  expression: PropTypes.instanceOf(Map).isRequired,
  facetList: PropTypes.array
};
