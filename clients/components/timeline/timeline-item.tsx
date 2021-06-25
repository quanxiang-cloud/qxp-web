import React from 'react';

import './index.scss';

interface Props {
  children?: React.ReactNode;
  color?: string;
}

function TimelineItem({ children, color }: Props) {
  return (
    <li className="timeline-item">
      <div className="timeline-item-tail" />
      <div className="timeline-item-head">
        <div
          className="timeline-item-head-in"
          style={{ backgroundColor: color ? color : undefined }}
        ></div>
      </div>
      <div className="timeline-item-content">{children}</div>
    </li>
  );
}

export default TimelineItem;
