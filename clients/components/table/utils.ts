import { useEffect, useState } from 'react';
import { FixedColumn, IdType, UnionColumns } from 'react-table';

import checkboxColumn from './checkbox-column';

export const getDefaultSelectMap = (keys: string[] | undefined): Record<IdType<any>, boolean> => {
  if (!keys) {
    return {};
  }

  const keyMap: any = {};
  keys.forEach((key) => {
    keyMap[key] = true;
  });
  return keyMap;
};

export function useExtendColumns<T = any>(originalColumns: UnionColumns<T>[], showCheckbox?: boolean) {
  const [columns, setColumns] = useState(originalColumns);

  useEffect(() => {
    if (showCheckbox) {
      const firstColumnFixed = originalColumns.length > 0 && (originalColumns[0] as FixedColumn<any>).fixed;
      setColumns([
        { ...checkboxColumn, fixed: firstColumnFixed },
        ...originalColumns,
      ]);
    }
  }, [showCheckbox, originalColumns]);
  return columns;
}
