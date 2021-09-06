import React, { useRef, useState, useEffect, isValidElement } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import cs from 'classnames';
import { usePopper } from 'react-popper';

export interface Props {
  content: JSX.Element;
  className?: string;
  triggerClassName?: string;
  tooltipClassName?: string;
  children?: React.ReactElement;
  dynamicTriggerRef?: React.MutableRefObject<any>;
  onVisibilityChange?: (visible: boolean) => void
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
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  open?: boolean;
}

export default function Popover({
  children,
  content,
  tooltipClassName,
  placement = 'bottom-start',
  offsetX = 0,
  offsetY = 4,
  onVisibilityChange,
  open = false,
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(
    triggerRef.current, tooltipRef.current,
    {
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

  useEffect(() => {
    onVisibilityChange?.(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (open !== isOpen) {
      setIsOpen(open);
    }
  }, [open]);

  useClickAway(tooltipRef, () => {
    setIsOpen(false);
  });

  return (
    <>
      {isValidElement(children) ? React.cloneElement(
        children,
        { ref: triggerRef, onClick: () => setIsOpen((isOpen) => !isOpen) },
      ) : (
        <span ref={triggerRef} onClick={() => setIsOpen((isOpen) => !isOpen)}>{children}</span>
      )}
      <div
        ref={tooltipRef}
        className={cs(
          {
            'pointer-events-none': !isOpen,
            invisible: !isOpen,
          },
          tooltipClassName,
        )}
        style={{ ...styles.popper, zIndex: 10 }}
        {...attributes.popper}
      >
        {isOpen && content}
      </div>
    </>
  );
}
