import React from 'react';
import cs from 'classnames';

import { Props } from '@m/qxp-ui-mobile';
import { DetailItem } from '@m/pages/approvals/detail/status-detail/utils';
import Avatar from '@m/qxp-ui-mobile/avatar';
import StatusTag from '../status-tag';
import FlowStatus from '@m/components/flow-status';
import Describe from '../describe';

import './index.scss';

export type DetailStatusRowProps = DetailItem & Props;

export default function DetailStatusRow(props: DetailStatusRowProps): JSX.Element {
  return (
    <>
      <div className={cs(
        `detail-status-row detail-status-row__${props.styleName} flex justify-center items-center`,
        props.className,
      )}>

        <Avatar name={props.creatorName} size='.27rem'/>

        <div className='detail-status-row-username title3 text-primary truncate'>
          {props.creatorName}
        </div>

        {!!props.status && (
          <>
            {props.styleName === 'normal' && <StatusTag status={props.status} autoReview className='ml-4'/>}
            {props.styleName === 'white' && (
              <FlowStatus
                status={props.status}
                className='ml-4 text-secondary'
                style={{ fontSize: '.14rem', lineHeight: '.22rem' }}
              />
            )}
          </>
        )}
      </div>

      {props.styleName === 'normal' && (
        <>
          {!!props.describes && <Describe describes={props.describes} className='ml-32 mt-8'/>}
          {!!props.time && <div className='body2 text-placeholder ml-32 mt-4'>{props.time}</div>}
        </>
      )}
    </>
  );
}
