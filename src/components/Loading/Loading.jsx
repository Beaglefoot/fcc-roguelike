import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { loading } from './Loading.scss';

class Loading extends React.PureComponent {
  constructor() {
    super();

    this.intervalId = 0;
    this.state = { dots: '.' };
    this.animateDots = this.animateDots.bind(this);
  }

  animateDots() {
    this.setState(({ dots }) => ({
      dots: dots.length < 5 ? '.'.repeat(dots.length + 1) : '.'
    }));
  }

  componentDidMount() {
    this.intervalId = setInterval(this.animateDots, 200);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div className={classNames(loading, this.props.className)}>{`Loading${this.state.dots}`}</div>
    );
  }
}

Loading.propTypes = {
  className: PropTypes.string
};


export default Loading;
