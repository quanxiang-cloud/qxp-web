import React, { useEffect, useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { omit, omitBy } from 'lodash';

import FormTableSelector from '@c/form-table-selector';

import { ActionsContext } from './config-form';
import { StoreContext } from '../../context';
import { getFormTableSchema } from './api';

function FormTableSelectorWrapper({ value, mutators }: ISchemaFieldComponentProps) {
  const { actions } = useContext(ActionsContext);
  const { pageID: pageId } = useContext(StoreContext);

  useEffect(() => {
    value && handleChange(value);
  }, []);

  function updateAvailableSchema(schema: ISchema) {
    actions.setFieldState('Fields.workTableSchemaOptions', (state) => {
      const schemas = omitBy(schema.properties, (value) => value?.['x-component'] === 'SubTable');
      state.value = Object.entries(schemas).map(([key, value]) => {
        return {
          label: value?.title,
          value: key,
          schema: value,
        };
      });
    });
    actions.getFieldState('Fields.subordination', (state) => {
      actions.getFieldState('Fields.columns', (st) => {
        const columns = st.value as {title: string; dataIndex: string}[];
        const cols = columns.map(({ dataIndex }) => dataIndex);
        let properties = {};
        if (state.value === 'foreign_table') {
          properties = Object.entries(schema.properties || {}).reduce(
            (cur: SchemaProperties, next: [string, ISchema]) => {
              const [key, sc] = next;
              if (cols.includes(key)) {
                cur[key] = sc;
              }
              return cur;
            }, {});
        }
        actions.setFieldState('Fields.items', (state) => {
          state.value = {
            type: 'object',
            properties,
          };
        });
      });
    });
  }

  async function handleChange(newValue: { tableID: string; appID: string; tableName: string; }) {
    if (!newValue.tableID || !newValue.appID) {
      return;
    }
    const { schema, tableID, tableName } = await getFormTableSchema<{
      schema: ISchema;
      tableID: string;
      tableName: string;
    }>(omit(newValue, 'tableName')) || {};
    mutators.change({ ...newValue, tableID, tableName });
    if (schema?.properties) {
      updateAvailableSchema(schema);
    }
  }

  return (
    <FormTableSelector
      value={{ value: value.tableID }}
      onChange={({ name: tableName, value: tableID }) => handleChange({
        ...value, tableID, tableName,
      })}
      exclude={[pageId]}
    />
  );
}

FormTableSelectorWrapper.isFieldComponent = true;

export default FormTableSelectorWrapper;
