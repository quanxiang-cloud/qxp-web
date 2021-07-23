import React, { useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

import FormTableSelector from '@c/form-table-selector';

import { StoreContext, ActionsContext } from '../context';

function LinkedTable({ value, mutators }: ISchemaFieldComponentProps): JSX.Element {
  const { pageID: pageId } = useContext(StoreContext);
  const { actions } = useContext(ActionsContext);

  function onChange({ name: tableName, value: tableID }: {
    name?: string;
    value?: string;
  }): void {
    if (!tableName || !value) {
      return;
    }
    actions.setFieldState('Fields.subTableColumns', (state) => {
      state.value = [];
    });
    actions.setFieldState('Fields.subTableSchema', (state) => {
      state.value = { type: 'object', properties: {} };
    });
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
