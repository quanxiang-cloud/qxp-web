import React from 'react';
import cs from 'classnames';
import { getSizeStyle } from '@m/qxp-ui-mobile/utils/format/unit';
import { IconProps } from './types';
import './index.scss';
import svgHash from '@c/icon/svg-hash';

export default function Icon(props: IconProps): JSX.Element {
  const { size = '0.16rem', name, style, className, type, clickable, disabled } = props;
  const _style: React.CSSProperties = getSizeStyle(size, style);

  return (
    <svg
      style={_style}
      className={cs('svg-icon', className, {
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
        [`svg-icon--${type}`]: type,
      })}
    >
      <use xlinkHref={`${svgHash}#${name}`} />
    </svg>
  );
}
