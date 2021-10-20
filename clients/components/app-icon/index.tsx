import React, { HTMLProps } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import './index.scss';

export type BgColor = 'amber' | 'indigo' | 'teal' | 'fuchsia' | 'emerald' | 'cyan' | 'red' | 'orange';

interface Props extends HTMLProps<HTMLDivElement> {
  size: 20 | 32 | 44 | 48;
  themeColor: BgColor;
  iconName?: string;
  className?: string;
}

const appIconSize = new Map([
  [20, 12],
  [32, 20],
  [44, 28],
  [48, 32],
]);

function AppIcon({
  size = 44, className, iconName, themeColor, ...restProps }: Props,
ref: React.Ref<HTMLDivElement>,
): JSX.Element {
  return (
    <div
      {...restProps}
      ref={ref}
      style={{
        width: size,
        height: size,
        borderRadius: (size * 0.27) + 'px',
        borderTopRightRadius: '2px',
        '--app-Icon-bg-offset': - size + 'px', // size / 44(single app icon size ) = offset / 44 ( total svg offset ) , so background offset = size
      } as React.CSSProperties}
      className={cs(
        'app-icon flex justify-center items-center relative overflow-hidden',
        `app-icon-bg-${themeColor}`, className,
      )}
    >
      {iconName ? (<Icon type='light' name={iconName} size={appIconSize.get(size)} />) : null}
    </div>
  );
}

export default React.forwardRef<HTMLDivElement, Props>(AppIcon);
