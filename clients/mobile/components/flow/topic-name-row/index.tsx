import React from 'react';

import { Props } from '@m/qxp-ui-mobile';
import Avatar from '@m/qxp-ui-mobile/avatar';

export interface TopicNameRowProps extends Props {
  creatorName: string;
  creatorAvatar: string;
  modifyTime: string;
  creatorId: string;
  isSelf: boolean;
}

export default function TopicNameRow(props: TopicNameRowProps): JSX.Element {
  return (
    <div className='flex justify-center items-center'>
      <Avatar size='.27rem' name={props.creatorName}/>
      <div className='flex-1 ml-8 mr-8 title3 text-primary truncate'>
        {props.creatorName}{props.isSelf ? '（我）' : ''}
      </div>
      <div className='body2 text-placeholder'>{props.modifyTime}</div>
    </div>
  );
}
