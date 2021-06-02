import React, { useEffect, useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { useParams } from 'react-router-dom';
import { omitBy } from 'lodash';

import FormTableSelector from '@c/form-table-selector';

import { ActionsContext } from './config-form';
import { getFormTableSchema } from './api';

export default function FormTableSelectorWrapper({ value, onChange }: ISchemaFieldComponentProps) {
  const { appID, pageId } = useParams<{ appID: string; pageId: string; }>();
  const actions = useContext(ActionsContext);

  useEffect(() => {
    if (value) {
      handleChange({ value });
    }
  }, []);

  async function handleChange({ value }: { value: string }) {
    onChange(value);
    const { schema } = await getFormTableSchema({ appID, tableID: value }) ?? {};
    actions.setFieldState('Fields.workTableSchemaOptions', (state) => {
      if (!schema?.properties) {
        state.value = [];
        return;
      }
      const schemas = omitBy(schema.properties, (value) => value?.['x-component'] === 'SubTable');
      state.value = Object.entries(schemas).map(([key, value]: any) => {
        return {
          label: value?.title,
          value: key,
          schema: value,
        };
      });
    });
    actions.getFieldState('Fields.columns', (state) => {
      const columns = state.initialValue as { title: string; dataIndex: string }[] ?? [];
      actions.setFieldState('Fields.items', (st) => {
        const properties = columns.reduce(
          (cur: Record<string, ISchema>, next: {title: string; dataIndex: string}) => {
            const sc = schema?.properties?.[next?.dataIndex];
            if (sc) {
              cur[next?.dataIndex] = sc;
            }
            return cur;
          }, {});
        st.value = {
          type: 'object',
          properties,
        };
      });
    });
  }

  return (
    <FormTableSelector
      value={{ value }}
      onChange={handleChange}
      exclude={[pageId]}
    />
  );
}
