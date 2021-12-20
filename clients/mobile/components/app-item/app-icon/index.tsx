import React, { CSSProperties } from 'react';
import './index.scss';
import { NumberString, Props } from '@m/qxp-ui-mobile';
import Icon from '@m/qxp-ui-mobile/icon';
import { addUnit } from '@m/qxp-ui-mobile/utils/format/unit';

export interface AppIconProps extends Props {
  size?: NumberString;
  iconSize?: NumberString;
  icon: string;
  bgColor?: string;
  color: string;
}

function computedSize(data: {
  size?: NumberString, iconSize?: NumberString, bgColor?: string
}): CSSProperties {
  let size;
  if (data.size) size = addUnit(data.size);
  else if (data.iconSize) {
    if (data.bgColor) {
      size = `calc(${addUnit(data.iconSize)} * 44 / 28)`;
    } else {
      size = addUnit(data.iconSize);
    }
  } else {
    size = '.44rem';
  }
  const radius = `calc(${addUnit(size)} * 0.27)`;
  return {
    width: addUnit(size),
    height: addUnit(size),
    borderRadius: radius + ' .02rem ' + radius + ' ' + radius,
  };
}

function computedIconSize(data: {
  size?: NumberString, iconSize?: NumberString,
}): string | undefined {
  if (data.iconSize) return addUnit(data.iconSize);
  if (data.size) return `calc(${addUnit(data.size)} * 28 / 44)`;
  return '.28rem';
}

function computedClassName(bgColor?: string): string {
  if (bgColor) {
    return 'app-bg-icon-circle bg-icon-circle-' + bgColor + ' bg-gradient-' + bgColor;
  }
  return '';
}

export default function AppIcon({
  size, iconSize, icon, bgColor, color,
}: AppIconProps): JSX.Element {
  return (
    <div
      className={`app-bg-icon flex justify-center items-center ${computedClassName(bgColor)}`}
      style={computedSize({ size, iconSize, bgColor })}>
      <Icon
        name={icon}
        className='app-icon__icon'
        size={computedIconSize({ size, iconSize })}
        style={color ? { color } : undefined}
      />
    </div>
  );
}
