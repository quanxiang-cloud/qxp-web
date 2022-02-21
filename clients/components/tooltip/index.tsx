import React, { DetailedHTMLProps, HTMLAttributes, useRef, cloneElement } from 'react';

import Popper, { Theme } from '@c/popper';

import Tip from './tip';

export type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  position: 'left' | 'right' | 'top' | 'bottom';
  label: JSX.Element | string;
  children?: JSX.Element;
  labelClassName?: string;
  wrapperClassName?: string;
  theme?: Theme;
  offset?: [number, number];
}

export default function ToolTip(props: Props): JSX.Element {
  const { children, position, offset = [0, 5], ...otp } = props;
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);

  const modifiers = [
    {
      name: 'offset',
      options: { offset },
    },
  ];

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
        trigger='hover'
        theme={props.theme}
      >
        <Tip
          {...otp}
        />
      </Popper>
    </>
  );
}
