import React from 'react';

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
      <div className={loading}>{`Loading${this.state.dots}`}</div>
    );
  }
}

export default Loading;
