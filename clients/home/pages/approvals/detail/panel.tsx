import React from 'react';
import cs from 'classnames';

import './index.scss';

interface Props {
  className?: string;
  children: React.ReactNode;
}

function Panel({ className, children }: Props): JSX.Element {
  return (
    <div className={cs('approval-panel', className)}>
      {children}
    </div>
  );
}

export default Panel;
