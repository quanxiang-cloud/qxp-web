import React from 'react';
import { TableDataCreateData } from '@newFlow/content/editor/type';

type ContextType = {
  data: Partial<TableDataCreateData>,
  setData: (val: Partial<TableDataCreateData>) => void;
}

export default React.createContext<ContextType>({
  data: {},
  setData(val: any) {
    Object.assign(this.data, { ...val });
  },
});

