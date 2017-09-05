import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import {
  help,
  overlay,
  text,
  legend,
  keys,
  symbol,
  meaning,
  tips,
  fadeEnter,
  fadeEnterActive,
  fadeExit,
  fadeExitActive
} from './Help.scss';

class Help extends React.PureComponent {
  constructor() {
    super();
    this.state = { visible: false };
    this.switchVisibility = this.switchVisibility.bind(this);
  }

  switchVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
      <div>
        <div
          className={help}
          onClick={this.switchVisibility}
        >
          Help
        </div>

        <CSSTransition
          timeout={300}
          in={this.state.visible}
          unmountOnExit
          classNames={{
            enter: fadeEnter,
            enterActive: fadeEnterActive,
            exit: fadeExit,
            exitActive: fadeExitActive,
          }}
        >
          <div>
            <div className={overlay} />
            <div
              className={text}
              onClick={this.switchVisibility}
            >
              <div className={legend}>
                <h3>Legend</h3>
                <div className={symbol}>@</div>
                <div className={meaning}>Player</div>
                <div className={symbol}>!</div>
                <div className={meaning}>Potion</div>
                <div className={symbol}>%</div>
                <div className={meaning}>Corpse</div>
                <div className={symbol}>^</div>
                <div className={meaning}>Portal</div>
                <div className={symbol}>[a-z]</div>
                <div className={meaning}>Creatures</div>
                <div className={symbol}>[A-Z]</div>
                <div className={meaning}>Bosses</div>
              </div>
              <div className={keys}>
                <h3>Key bindings</h3>
                <div className={symbol}>&#8592;&#8594;&#8593;&#8595;</div>
                <div className={meaning}>Movement</div>
                <div className={symbol}>p</div>
                <div className={meaning}>Pick item</div>
                <div className={symbol}>h</div>
                <div className={meaning}>Consume the first health potion from inventory</div>
              </div>
              <div className={tips}>
                <h3>Tips</h3>
                <ul>
                  <li>To get weapon and armor you have to fight other creatures</li>
                  <li>To fight a creature simply move in its direction</li>
                  <li>You use portals to move between levels</li>
                  <li>Read Story Log to know which corpses are worth scavenging</li>
                </ul>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default Help;
