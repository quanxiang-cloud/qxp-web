import React from 'react';
import cs from 'classnames';

import { Props } from '@m/qxp-ui-mobile';
import { TimelineStatus } from '@m/pages/approvals/detail/status/utils';

import './index.scss';

export interface TimeDotProps extends Props {
  status: TimelineStatus;
}

export default function TimelineDot(props: TimeDotProps): JSX.Element {
  return (
    <div className={cs(
      `timeline-dot-wrapper timeline-dot-wrapper-${props.status}`,
      props.className,
      'flex justify-center items-center',
    )}>
      <div className={`timeline-dot timeline-dot-${props.status}`}/>
    </div>
  );
}
