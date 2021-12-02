import React from 'react';
import classnames from 'classnames';

import Icon from '@c/icon';

interface Props {
  name: string;
  color?: string;
  style?: React.CSSProperties;
}

export default function CustomAvatar({ name, color = 'bg-gray-500', style }: Props): JSX.Element {
  return (
    <div style={style}
      className={classnames('w-24 h-24 rounded-full text-center align-middle', color)}>
      <Icon className="text-white" name={name} size={12}/>
    </div>
  );
}
