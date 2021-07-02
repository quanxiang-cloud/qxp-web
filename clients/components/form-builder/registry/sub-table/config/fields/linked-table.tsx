import React, { useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

import FormTableSelector from '@c/form-table-selector';

import { StoreContext } from '../context';

function LinkedTable({ value, mutators }: ISchemaFieldComponentProps): JSX.Element {
  const { pageID: pageId } = useContext(StoreContext);

  function onChange({ name: tableName, value: tableID }: {
    name?: string;
    value?: string;
  }): void {
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
