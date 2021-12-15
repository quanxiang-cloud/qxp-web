import React, { useState, ForwardedRef, forwardRef } from 'react';
import { useUpdateEffect } from 'react-use';

import Content from './content';
import Mask from './mask';

import './index.scss';

type Props = {
  onCancel: () => boolean | void;
  title: string | JSX.Element;
  children: React.ReactNode;
  distanceTop?: number;
  className?: string;
  visible: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  content?: typeof Content;
}

function Drawer({
  onCancel,
  title,
  children,
  className,
  position = 'bottom',
  visible,
  distanceTop = 56,
  content,
}: Props, ref: ForwardedRef<HTMLDivElement | null>): JSX.Element | null {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [contentShow, setContentShow] = useState(visible);
  const LocalContent = content ?? Content;

  let timeID = -1;

  useUpdateEffect(() => {
    if (visible === false) {
      setBeganClose(true);
      timeID = window.setTimeout(() => {
        setContentShow(false);
      }, 300);
    } else {
      setBeganClose(false);
      setContentShow(true);
    }
    return () => {
      clearTimeout(timeID);
    };
  }, [visible]);

  if (!contentShow) {
    return null;
  }

  return (
    <Mask
      ref={ref}
      beganClose={beganClose}
      contentShow={contentShow}
      className={className}
      position={position}
    >
      <LocalContent onCancel={onCancel} title={title} distanceTop={distanceTop}>
        {children}
      </LocalContent>
    </Mask>
  );
}

export default forwardRef<HTMLDivElement, Props>(Drawer);
