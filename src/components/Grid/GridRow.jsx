import React from 'react';

class GridRow extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    const { playerRow } = nextProps;
    const { visibilityRadius, rowIndex } = this.props;
    const minRow = playerRow - visibilityRadius - 1;
    const maxRow = playerRow + visibilityRadius + 1;
    return (
      !playerRow ||
      new Array(maxRow - minRow + 1)
        .fill()
        .map((_, i) => i + minRow)
        .some(row => row === rowIndex)
    );
  }

  render() {
    return <tr>{this.props.children}</tr>;
  }
}

export default GridRow;
