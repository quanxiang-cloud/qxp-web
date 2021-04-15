import { useState, useEffect } from 'react';
import { Column } from 'react-table';

export const getDefaultSelectMap = (keys: string[] | undefined) => {
  if (!keys) {
    return {};
  }

  const keyMap: any = {};
  keys.forEach((key) => {
    keyMap[key] = true;
  });
  return keyMap;
};

type FixedMap = {
  [key: string]: React.CSSProperties
}

export function useComputeColumnsPosition<T extends Record<string, unknown>>(
  rowKey: string,
  columns: Array<Omit<Column<T>, 'columns'> & {
    fixed?: boolean;
    width?: number;
  }>): FixedMap {
  const [positionMap, setPositionMap] = useState({});

  useEffect(() => {
    const _positionMap: any = {};
    let marginLeft = 0;
    columns.forEach(({ fixed, width, ...otherProps }) => {
      if (!fixed) {
        return;
      }

      const id = (otherProps as any)[rowKey];

      const _marginLeft = marginLeft;
      marginLeft += Number(width);
      _positionMap[id] = { left: _marginLeft + 'px', position: 'sticky', zIndex: 1 };
    });

    const rightKeySort = Object.keys(_positionMap).reverse();

    Object.keys(_positionMap).forEach((key, index) => {
      _positionMap[key].right = _positionMap[rightKeySort[index]].left;
    });

    setPositionMap(_positionMap);
  }, [columns]);
  return positionMap;
}
