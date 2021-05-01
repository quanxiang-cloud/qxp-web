import React from 'react';
import cs from 'classnames';

import { Props } from './index';

import './style.scss';

interface ToolTipProps extends Props {
  show: boolean;
}

export default function({
  position,
  className,
  show,
  arrowStyle,
  style,
  label,
  labelClassName,
}: ToolTipProps) {
  return (
    <div
      style={style}
      className={cs('qxp-ui-tooltip bg-gray-700 cursor-default', position, className, {
        hidden: !show,
        flex: show,
      })}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="qxp-ui-tooltip-arrow" style={arrowStyle} />
      <div className={cs('qxp-ui-tooltip-label', labelClassName)}>{label}</div>
    </div>
  );
}
