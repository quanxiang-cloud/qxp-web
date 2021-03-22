import * as React from 'react';
import classnames from 'classnames';

import { IconName } from './types';

interface Iicon extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  type?: 'dark' | 'coloured' | 'light';
  size?: number;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

export const SvgIcon = ({ name, ...props }: Iicon) => {
  const _style: React.CSSProperties = {
    ...props.style,
    width: props.size ? `${props.size - 1}px` : undefined,
    height: props.size ? `${props.size - 1}px` : undefined,
  };
  console.log(`#${name}`);
  return (
    <svg
      {...props}
      ref={props.ref}
      data-name={name}
      style={_style}
      className={classnames('svg-icon', props.className, {
        [`svg-icon--${props.type}`]: props.type,
        'svg-icon--changeable': props.changeable,
        'svg-icon--clickable': props.clickable,
        'svg-icon--disabled': props.disabled,
      })}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

export default React.forwardRef(SvgIcon);
