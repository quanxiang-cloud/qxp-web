import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { useParams } from 'react-router-dom';
import { omitBy } from 'lodash';

import FormTableSelector from '@c/form-table-selector';

import { actions } from './config-form';
import { getFormTableSchema } from './api';

export default function FormTableSelectorWrapper({ value, onChange }: ISchemaFieldComponentProps) {
  const { appID } = useParams<{ appID: string }>();

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
  }

  return (
    <FormTableSelector
      value={{ value }}
      onChange={handleChange}
    />
  );
}
