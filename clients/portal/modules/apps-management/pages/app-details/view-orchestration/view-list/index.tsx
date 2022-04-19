import React from 'react';
import cs from 'classnames';

import ViewItem from './view-item';
import { View } from '../types.d';

import './index.scss';

type Props = {
  views: View[];
  currentView: View;
  homeView?: View;
  className?: string;
  onViewClick?: (view: View) => void;
  onOptionClick?: (key: string, view: View) => void;
}

function ViewList({
  views = [],
  className,
  ...rest
}: Props): JSX.Element {
  return (
    <ul className={cs('view-list', className)}>
      {views.map((view: View) => (
        <ViewItem
          {...rest}
          key={view.id}
          view={view}
        />
      ))}
    </ul >
  );
}

export default ViewList;
