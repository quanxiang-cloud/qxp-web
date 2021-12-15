import cs from 'classnames';
import { isUndefined } from 'lodash';
import React, {
  forwardRef, FC, ForwardedRef, MouseEvent, useState, CSSProperties, useEffect, useCallback,
} from 'react';

import { getElementWidth, getElementHeight } from '@polyApi/utils/dom';

type Option = {
  position: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  minWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  maxWidth?: number;
  style?: CSSProperties;
}

export default function withDragResize(
  Comp: FC<any>,
  {
    position,
    className,
    minWidth,
    minHeight,
    maxWidth = document.body.clientWidth,
    maxHeight = document.body.clientHeight,
    style,
  }: Option,
): FC<any> {
  const cls = cs('absolute transition-all duration-240 bg-transparent hover:bg-blue-600 z-1', {
    'w-7 -left-3 top-0 bottom-0 resize-x': position === 'left',
    'h-7 left-0 -top-3 right-0 resize-y': position === 'top',
    'w-7 -right-3 top-0 bottom-0 resize-x': position === 'right',
    'h-7 left-0 -bottom-3 right-0 resize-y': position === 'bottom',
  });
  let x = 0;
  let y = 0;
  let isMouseDown = false;
  let originalTransition = '';
  let width = 0;
  let height = 0;

  return forwardRef((props: any, ref: ForwardedRef<any>): JSX.Element => {
    const [resizableEl, setResizableEl] = useState<HTMLDivElement | null>(null);

    const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>): void => {
      if (!resizableEl) {
        return;
      }
      width = getElementWidth(resizableEl);
      height = getElementHeight(resizableEl);
      x = e.clientX;
      y = e.clientY;
      originalTransition = resizableEl.style.transition;
      resizableEl.style.transition = 'none';
      Object.assign(resizableEl.style, { [position]: '' });
      isMouseDown = true;
    }, [resizableEl, position]);

    const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>): void => {
      if (!resizableEl || !isMouseDown) {
        return;
      }
      if (position === 'left' || position === 'right') {
        const dx = e.clientX - x;
        x = e.clientX;
        width = (position === 'left' ? -dx : dx) + width;
        if (!isUndefined(minWidth) && width < minWidth) {
          width = minWidth;
        }
        if (!isUndefined(maxWidth) && width > maxWidth) {
          width = maxWidth;
        }
        resizableEl.style.width = `${width}px`;
      }
      if (position === 'top' || position === 'bottom') {
        const dy = e.clientY - y;
        y = e.clientY;
        height = (position === 'top' ? -dy : dy) + height;
        if (!isUndefined(minHeight) && height < minHeight) {
          height = minHeight;
        }
        if (!isUndefined(maxHeight) && height > maxHeight) {
          height = maxHeight;
        }
        resizableEl.style.height = `${height}px`;
      }
    }, [resizableEl, isMouseDown, position, x, y, width, height, minWidth, maxWidth, minHeight, maxHeight]);

    const onMouseUp = useCallback((): void => {
      isMouseDown = false;
      x = 0;
      y = 0;
      width = 0;
      height = 0;
      if (resizableEl) {
        resizableEl.style.transition = originalTransition;
      }
      originalTransition = '';
    }, [resizableEl]);

    useEffect(() => {
      const _onMouseMove = (e: Event): void => onMouseMove(e as unknown as MouseEvent<HTMLDivElement>);
      const _onMouseUp = (): void => onMouseUp();
      document.addEventListener('mousemove', _onMouseMove);
      document.addEventListener('mouseup', _onMouseUp);
      return () => {
        document.removeEventListener('mousemove', _onMouseMove);
        document.removeEventListener('mouseup', _onMouseUp);
      };
    }, [onMouseMove, onMouseUp]);

    const styles: CSSProperties = {
      ...style,
      cursor: ['left', 'right'].includes(position) ? 'col-resize' : 'row-resize',
    };

    return (
      <div className={className} ref={setResizableEl} style={styles}>
        <div className={cls} onMouseDown={onMouseDown}>
        </div>
        <Comp {...props} ref={ref}>{props.children}</Comp>
      </div>
    );
  });
}
