import React, { useMemo } from 'react';
import classnames from 'classnames';

import { AvatarNameRowProps } from '@m/pages/approvals/detail/status/utils';
import Avatar from '@m/qxp-ui-mobile/avatar';
import StatusTag from '@m/components/flow/status-tag';
import Icon from '@m/qxp-ui-mobile/icon';
import { NumberString } from '@m/qxp-ui-mobile';
import { getSizeStyle } from '@m/qxp-ui-mobile/utils/format/unit';

export type FlowAvatarNames = 'edit' | 'approval' | 'hourglass_empty' | 'send' | 'stop_circle';

interface FlowAvatarProps {
  name: FlowAvatarNames;
  size: NumberString;
  style?: React.CSSProperties;
  className?: string;
}

export function FlowAvatar({ name, style, size, className }: FlowAvatarProps) : JSX.Element {
  const color = useMemo(() => {
    switch (name) {
    case 'edit':
      return 'bg-teal-500';
    case 'approval':
      return 'bg-indigo-500';
    case 'hourglass_empty':
    case 'send':
    case 'stop_circle':
      return 'bg-gray-500';
    }
    return 'bg-gray-500';
  }, [name]);

  return (
    <div style={getSizeStyle(size, style)}
      className={classnames('rounded-full flex justify-center items-center', color, className)}>
      <Icon style={{ color: 'white' }} name={name} size='.12rem'/>
    </div>
  );
}

export default function AvatarNameRow(props: AvatarNameRowProps): JSX.Element {
  return (
    <div className='flex w-full'>
      {!!props.avatar && <FlowAvatar name={props.avatar} size='.28rem' className='mr-8 ml-16'/>}
      {!props.avatar && <Avatar size='.27rem' name={props.userName} className='mr-8 ml-16'/>}
      <div className={`body1 text-secondary flex-1 ${props.status ? 'truncate' : ''}`}>
        {props.text?.map((item, index) => {
          return (
            <span key={index} className={item.className}>{item.text}</span>
          );
        })}
      </div>
      {!!props.status && <StatusTag status={props.status} className='ml-8'/>}
    </div>
  );
}
