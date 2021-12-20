import React from 'react';
import AppIcon from './app-icon';
import './index.scss';
import { NumberString, Props } from '@m/qxp-ui-mobile';

export type NewAppInfo = AppInfo & { appIcon: AppIconInfo };

export interface AppItemProps extends Props {
  icon: string;
  bgColor?: string;
  iconColor?: string;
  size?: string;
  iconSize?: NumberString;
  appName: string;
}

export default function AppItem({
  icon, bgColor, iconColor = 'white', iconSize, size, appName, className, onClick,
}: AppItemProps): JSX.Element {
  return (
    <div onClick={onClick}
      className={`${className} flex-col flex overflow-hidden items-center padding-8 pointer-8`}
    >
      <AppIcon
        icon={icon}
        bgColor={bgColor}
        color={iconColor}
        iconSize={iconSize}
        size={size}
      />
      <p className='app-name body2 text-secondary text-center mt-4'>{appName}</p>
    </div>
  );
}

