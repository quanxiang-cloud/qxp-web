import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

interface Props {
  className?: string;
  onToggle?: () => void;
  isContentVisible: boolean;
}

export default function ArrowDownTrigger({ onToggle, isContentVisible, className = '' }: Props): JSX.Element {
  return (
    <Icon
      clickable
      name="keyboard_arrow_down"
      className={cs(`transition duration-240 transform ${className}`, {
        '-rotate-180': isContentVisible,
      })}
      onClick={onToggle}
    />
  );
}
