import React from 'react';
import { TableDataUpdateData } from '@newFlow/content/editor/type';

type ContextType = {
  data: Partial<TableDataUpdateData>,
  setData: (val: Partial<TableDataUpdateData>) => void;
}

export const valueFromOptions = [
  { label: '自定义', value: 'fixedValue' },
  { label: '节点输出', value: 'nodesOutput' },
  // { label: '全局输出', value: 'globalOutput' },
];

export const globalOutputOptions = [
  { label: 'appID', value: '$(params.appID)' },
  { label: 'tableID', value: '$(params.tableID)' },
  { label: 'dataID', value: '$(params.dataID)' },
];
export default React.createContext<ContextType>({
  data: {},
  setData(val: any) {
    Object.assign(this.data, { ...val });
  },
});

