import React, { useRef, useState, MouseEvent } from 'react';
import { usePopper } from 'react-popper';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import useClickAway from 'react-use/lib/useClickAway';

export interface IPopover {
  content: JSX.Element;
  className?: string;
  triggerClassName?: string;
  tooltipClassName?: string;
  children: JSX.Element;
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
    | 'auto'
    | 'auto-start'
    | 'auto-end';
  offsetX?: number;
  offsetY?: number;
}

export const Popover = ({
  children,
  content,
  className,
  triggerClassName,
  tooltipClassName,
  placement = 'bottom-start',
  offsetX = 0,
  offsetY = 50,
}: IPopover) => {
  const clickAwayRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(triggerRef.current, tooltipRef.current, {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [offsetX, offsetY],
        },
      },
    ],
  });
  const [isOpen, setIsOpen] = useState(false);
  useClickAway(clickAwayRef, () => setIsOpen(false));
  const onContentClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      return;
    }
    setIsOpen(false);
  };

  return (
    <div
      className={twCascade(className)}
      onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      ref={clickAwayRef}
    >
      <div
        ref={triggerRef}
        className={twCascade(triggerClassName)}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        {children}
      </div>
      <div
        ref={tooltipRef}
        className={twCascade(
            {
              invisible: !isOpen,
              'pointer-events-none': !isOpen,
            },
            tooltipClassName,
            'mt-2',
        )}
        style={{ ...styles, margin: 0 }}
        {...attributes.popper}
        onClick={onContentClick}
      >
        {content}
      </div>
    </div>
  );
};
