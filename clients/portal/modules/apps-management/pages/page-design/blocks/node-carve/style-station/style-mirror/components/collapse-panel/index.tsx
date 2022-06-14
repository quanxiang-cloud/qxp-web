import React, { useState } from 'react';
import cs from 'classnames';
import Icon from '@one-for-all/icon';

export type Props = {
  title: string | ((isCollapse: boolean) => JSX.Element);
  children: React.ReactNode;
  defaultCollapse?: boolean;
  titleClassName?: string;
  contentClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  onCollapse?: (isCollapse: boolean) => void;
}

function CollapsePanel({
  style,
  className,
  title,
  defaultCollapse = true,
  titleClassName,
  contentClassName,
  onCollapse,
  children,
}: Props): JSX.Element {
  const [isCollapse, setIsCollapse] = useState<boolean>(defaultCollapse);

  function onTitleClick(): void {
    setIsCollapse((prevCollapse) => {
      onCollapse?.(!prevCollapse);
      return !prevCollapse;
    });
  }

  return (
    <div
      style={style}
      className={cs('flex flex-col w-full', className)}
    >
      <div
        onClick={onTitleClick}
        className={cs('flex justify-between items-center px-12 py-8 text-gray-900', titleClassName)}
      >
        {typeof title === 'string' ? title : title?.(isCollapse)}
        <Icon
          size={20}
          name={isCollapse ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
        />
      </div>
      <div
        style={{ height: isCollapse ? 0 : 'auto' }}
        className={cs('overflow-hidden', contentClassName)}
      >
        {children}
      </div>
    </div>
  );
}

export default CollapsePanel;
