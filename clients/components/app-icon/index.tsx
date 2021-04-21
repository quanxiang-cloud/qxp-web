import React, { HTMLProps } from 'react';

import Icon from '@c/icon';

export type BgColor =
  'amber' | 'indigo' | 'teal' | 'fuchsia' | 'emerald' | 'cyan' | 'red' | 'orange';

interface Props extends HTMLProps<HTMLDivElement> {
  themeColor: BgColor;
  iconName?: string;
  size: 32 | 44 | 48;
  className?: string;
}

const appIconSize = new Map([
  [32, 20],
  [44, 28],
  [48, 32],
]);

function AppIcon(
  { size = 44, className = '', iconName, themeColor, ...restProps }: Props,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      style={{
        '--app-Icon-size': size + 'px',
        '--app-icon-border-radius': (size * 0.27) + 'px',
      } as React.CSSProperties}
      className={`
        app-bg-icon
        app-bg-icon-circle 
        ${className} 
        bg-gradient-${themeColor} 
        bg-icon-circle-${themeColor}`
      }
      {...restProps}
    >
      {iconName ? (
        <Icon type='light' name={iconName} size={appIconSize.get(size)} />
      ) : null}
    </div>
  );
}

export default React.forwardRef<HTMLDivElement, Props>(AppIcon);
