import React, { useEffect, useState, useRef } from 'react';

import BoundaryItem from './item';
import './index.scss';

export type ItemProps = {
  key: React.Key,
  defaultSpan: number;
  content: React.ReactNode;
};

type Props = {
  items: ItemProps[];
};

const TOTAL_SPAN = 100;

function Boundary({
  items,
}: Props): JSX.Element {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const [childrenSize, setChildrenSize] = useState<number[]>([]);

  useEffect(() => {
    const itemSize = items.map(({ defaultSpan }) => defaultSpan / TOTAL_SPAN * 100);
    setChildrenSize(itemSize);
  }, []);

  function handleChangeSize(index: number, size: number, cb: () => void): void {
    if (timer.current) return;

    timer.current = window.setTimeout(() => {
      clearTimeout(timer.current);
      timer.current = undefined;
    }, 60);

    const boundaryWidth = boundaryRef.current?.scrollWidth;
    if (!boundaryWidth) return;

    const changeSpan = size / boundaryWidth * TOTAL_SPAN;

    const _childrenSize = [...childrenSize];
    _childrenSize[index] = _childrenSize[index] + changeSpan;
    _childrenSize[index + 1] = _childrenSize[index + 1] - changeSpan;

    setChildrenSize(_childrenSize);
    cb();
  }

  return (
    <div
      ref={boundaryRef}
      className='boundary-outer-box'
      style={{ height: '100%', margin: 0 }}
    >
      <div className='boundary-box h-full w-full'>
        <div
          className='boundary-content'
          style={{ height: '100%', flexDirection: 'row' }}
        >
          {items.map(({ content, key }, i) => (
            <BoundaryItem
              key={key}
              size={childrenSize[i]}
              changeSize={(size, cb) => handleChangeSize(i, size, cb)}
            >
              { content }
            </BoundaryItem>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Boundary;
