import React from 'react';
import { connect } from 'react-redux';

class Logger extends React.Component {
  componentWillReceiveProps({ action }) {
    console.log(action.get('type'), action.get('payload'));
  }

  render() {
    const { action } = this.props;
    return (
      <div>
        <div>Story Log:</div>
        <div>{action.get('type')}</div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  { action: state.get('lastAction') }
);

export default connect(mapStateToProps)(Logger);
