import React, { DetailedHTMLProps, HTMLAttributes, useRef, cloneElement } from 'react';

import Popper, { Theme, TriggerMethod } from '@c/popper';

import Tip from './tip';

export type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  position: 'left' | 'right' | 'top' | 'bottom';
  label: JSX.Element | string;
  children?: JSX.Element;
  labelClassName?: string;
  wrapperClassName?: string;
  theme?: Theme;
  trigger?: TriggerMethod;
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 5],
    },
  },
];

export default function ToolTip(props: Props): JSX.Element {
  const { children, position, ...otp } = props;
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);

  return (
    <>
      {
        cloneElement(children as React.ReactElement, { ref: reference })
      }
      <Popper
        ref={popperRef}
        reference={reference}
        className='qxp-tooltip-container'
        placement={position || 'bottom-start'}
        modifiers={modifiers}
        trigger={props.trigger || 'hover'}
        theme={props.theme}
      >
        <Tip
          {...otp}
        />
      </Popper>
    </>
  );
}
