import React from 'react';
import cs from 'classnames';
import { getSizeStyle } from '@m/qxp-ui-mobile/utils/format/unit';
import { IconProps } from './types';
import './index.scss';
// @ts-ignore
import svgHash from '@c/icon/svg-hash';

const iconPrefix = 'm-';

export default function Icon(props: IconProps): JSX.Element {
  const { size = '0.16rem', name, style, className, type, clickable, disabled, addPrefix } = props;
  const _style: React.CSSProperties = getSizeStyle(size, style);

  function getIconName(name: string): string {
    if (name.startsWith(iconPrefix)) return name;
    return addPrefix ? `${iconPrefix}${name}` : name;
  }

  return (
    <svg
      onClick={props.onClick}
      style={_style}
      className={cs('svg-icon', className, {
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
        [`svg-icon--${type}`]: type,
      })}
    >
      <use xlinkHref={`${svgHash}#${getIconName(name)}`} />
    </svg>
  );
}
