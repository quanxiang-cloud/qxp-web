import React, { useRef, useState } from 'react';
import cs from 'classnames';

type PositionType = 'left' | 'right';

type Props = {
  position: PositionType,
  changeSize?: (size: number, cb: () => void) => void;
  changed?: (size: number) => void;
};

const HALF_HANDLE = 2;
const HALF_MASK_WIDTH = 296;

export default function HandleLine({ position, changeSize, changed }: Props): JSX.Element {
  const [width, setWidth] = useState(1);
  const [location, setLocation] = useState(-3);
  const handleRef = useRef<HTMLDivElement>(null);
  const downLocation = useRef(-1);
  const nowLocation = useRef(-HALF_HANDLE);

  function handleMouseDown(e: React.MouseEvent): void {
    e.stopPropagation();
    downLocation.current = e.screenX;
    nowLocation.current = location - HALF_MASK_WIDTH;
    setWidth((HALF_MASK_WIDTH + HALF_HANDLE) * 2);
    setLocation(nowLocation.current);
  }

  function handleMouseMove(e: React.MouseEvent): void {
    e.stopPropagation();
    if (downLocation.current === -1) return;

    setLocation(computedLocationByEvent(e));

    changeSize?.(e.screenX - downLocation.current, () => {
      nowLocation.current = -HALF_HANDLE - HALF_MASK_WIDTH;
      downLocation.current = e.screenX;
      setLocation(nowLocation.current);
    });
  }

  function handleMouseUp(e: React.MouseEvent): void {
    e.stopPropagation();

    setLocation(computedLocationByEvent(e));

    changed?.(e.screenX - downLocation.current);
    reset();
  }

  function computedLocationByEvent(e: React.MouseEvent): number {
    if (position === 'left') {
      return nowLocation.current + e.screenX - downLocation.current;
    }
    return nowLocation.current - e.screenX + downLocation.current;
  }

  function reset(): void {
    downLocation.current = -1;
    nowLocation.current = -HALF_HANDLE;
    setWidth(1);
    setLocation(-HALF_HANDLE);
  }

  const style = position === 'left' ? { left: location } : { right: location };

  return (
    <div
      ref={handleRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={cs('handle-line')}
      style={{ ...style, width }}
    >
      <div></div>
    </div>
  );
}
