import React from 'react';
import { connect } from 'react-redux';

import { logger } from './Logger.scss';

class Logger extends React.PureComponent {
  constructor() {
    super();

    this.state = { history: [] };
  }

  componentWillReceiveProps({ action }) {
    this.setState({ history: this.state.history.concat(action.get('type')) });
  }

  componentDidUpdate() {
    const element = document.getElementsByClassName(logger)[0];
    element.scrollTop = element.scrollHeight;
  }

  render() {
    return (
      <div>
        <div>Story Log:</div>
        <div className={logger}>
          {
            this.state.history.map((record, index) => (
              <div key={index}>{record}</div>
            ))
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  { action: state.get('lastAction') }
);

export default connect(mapStateToProps)(Logger);
