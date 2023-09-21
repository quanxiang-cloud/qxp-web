import React from 'react';
import cs from 'classnames';

import './index.scss';

interface Props {
  tips?: string;
  className?: string;
}

function NoData({ tips, className }: Props) {
  return (
    <div className={cs('no-data', className)}>
      <div className='pic'/>
      <div className="tips">{tips}</div>
    </div>
  );
}

export default NoData;
