import React, {PureComponent} from 'react';

export default class Pin extends PureComponent {
  static defaultProps = {
    index: -1,
    opacity: 1,
    selected: false,
  }

  render() {
    const {index, opacity, selected, zIndex} = this.props
    return (
      <span style={{
        background: selected ? "#008DF0" : "#FFFFFF",
        border: '3px solid #008DF0',
        borderRadius: 32,
        color: selected ? "#FFFFFF" : "#008DF0",
        fontFamily: 'Helvetica',
        fontSize: 14,
        fontWeight: 'bold',
        opacity: opacity,
        padding: '6px 10px',
      }}>{index+1}</span>
    );
  }
}