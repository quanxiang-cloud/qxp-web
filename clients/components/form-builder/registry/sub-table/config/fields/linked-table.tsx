import React, { useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

import FormTableSelector from '@c/form-table-selector';

import { StoreContext } from '../context';

// columns 和 items 没有任何交集
// 从空白创建和选择已有分成两个组件
// 不必走 x-proxy formSchema
// 选择已有 黑名单, 白名单过滤 字段

interface LinkedTable {
  appID: string;
  tableID: string;
  tableName: string;
}

function LinkedTable({ value, mutators }: ISchemaFieldComponentProps) {
  const { pageID: pageId } = useContext(StoreContext);

  function onChange({ name: tableName, value: tableID }: {
    name?: string;
    value?: string;
  }) {
    if (!tableName || !value) {
      return;
    }
    mutators.change({ ...value, tableID, tableName });
  }

  return (
    <FormTableSelector
      value={{ value: value.tableID }}
      onChange={onChange}
      exclude={[pageId]}
    />
  );
}

LinkedTable.isFieldComponent = true;

export default LinkedTable;
