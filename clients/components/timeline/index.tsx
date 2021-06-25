import React, { cloneElement } from 'react';
import classNames from 'classnames';

import TimelineItem from './timeline-item';

import './index.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  pending?: React.ReactNode;
  style?: React.CSSProperties;
  reverse?: boolean;
  mode?: 'left' | 'alternate' | 'right' | ''
}

function Timeline({ children, pending = null, className, reverse = false, mode = '' }: Props) {
  const timelineItems = React.Children.toArray(children);

  if (reverse) {
    timelineItems.reverse();
  }

  const getPositionCls = (ele: React.ReactElement<any>, idx: number) => {
    if (mode === 'alternate') {
      if (ele.props.position === 'right') return 'timeline-item-right';
      if (ele.props.position === 'left') return 'timeline-item-left';
      return idx % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right';
    }
    if (mode === 'left') return 'timeline-item-left';
    if (mode === 'right') return 'timeline-item-right';
    if (ele.props.position === 'right') return 'timeline-item-right';
    return '';
  };

  const truthyItems: any = timelineItems.filter((item) => !!item);
  const itemsCount = React.Children.count(truthyItems);
  const lastCls = 'timeline-item-last';
  const items = React.Children.map(truthyItems, (ele: React.ReactElement<any>, idx) => {
    const pendingClass = idx === itemsCount - 2 ? lastCls : '';
    const readyClass = idx === itemsCount - 1 ? lastCls : '';
    return cloneElement(ele, {
      className: classNames([
        ele.props.className,
        !reverse && !!pending ? pendingClass : readyClass,
        getPositionCls(ele, idx),
      ]),
    });
  });

  return (
    <ul className={classNames('timeline', className)}>
      {items}
    </ul>
  );
}

Timeline.Item = TimelineItem;

export default Timeline;
