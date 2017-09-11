import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { calcPercentage } from '../../helpers/common';
import { bar, text, line } from './Bar.scss';

const Bar = ({ className, value, max, min = 0 }) => (
  <div className={classNames(bar, className)}>
    <div
      className={line}
      style={{ width: calcPercentage(value, max, min) + '%' }}
    />
    <div className={text}>
      {`${value} / ${max}`}
    </div>
  </div>
);

Bar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  className: PropTypes.string
};

export default Bar;
