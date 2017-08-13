import React from 'react';

class GridRow extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    const { playerRow } = nextProps;
    return !playerRow || [playerRow - 1, playerRow, playerRow + 1].some(row => row === this.props.rowIndex);
  }

  render() {
    return <tr>{this.props.children}</tr>;
  }
}

export default GridRow;
