import shallowEqual from 'react/lib/shallowEqual';

export default function PureRender(Component) {
  Component.prototype.shouldComponentUpdate = function compareShallow(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  };
  return Component;
}
