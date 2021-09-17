import React, { useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

import { StoreContext } from '@c/form-builder/context';
import FormTableSelector from '@c/form-table-selector';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';

function LinkedTable({ value, mutators }: ISchemaFieldComponentProps): JSX.Element {
  const { pageID: pageId } = useContext(StoreContext);
  const { actions } = useContext(FieldConfigContext);

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
