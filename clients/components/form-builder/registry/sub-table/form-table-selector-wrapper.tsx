import React, { useEffect, useContext, useState } from 'react';
import { ISchemaFieldComponentProps, useFormEffects, FormEffectHooks } from '@formily/antd';
import { omitBy } from 'lodash';

import FormTableSelector from '@c/form-table-selector';

import { ActionsContext } from './config-form';
import { StoreContext } from '../../context';
import { getFormTableSchema } from './api';

const { onFieldValueChange$ } = FormEffectHooks;

export default function FormTableSelectorWrapper({ value, onChange }: ISchemaFieldComponentProps) {
  const [appID, setAppID] = useState('');
  const [pageId, setPageID] = useState('');
  const actions = useContext(ActionsContext);
  const store = useContext(StoreContext);

  useFormEffects(() => {
    onFieldValueChange$('Fields.appID').subscribe((state) => {
      if (state.value && !store.appID) {
        setAppID(state.value);
      }
    });
    onFieldValueChange$('Fields.tableID').subscribe((state) => {
      if (state.value && !store.pageID) {
        setPageID(state.value);
      }
    });
  });

  useEffect(() => {
    if (value) {
      handleChange({ value });
    }
  }, []);

  useEffect(() => {
    if (store.appID) {
      setAppID(store.appID);
    }
  }, [store.appID]);

  useEffect(() => {
    if (store.pageID) {
      setPageID(store.pageID);
    }
  }, [store.pageID]);

  async function handleChange({ value }: { value: string }) {
    onChange(value);
    const { schema } = await getFormTableSchema<{
      schema: ISchema;
    }>({ appID, tableID: value }) || {};
    actions.setFieldState('Fields.workTableSchemaOptions', (state) => {
      if (!schema?.properties) {
        state.value = [];
        return;
      }
      const schemas = omitBy(schema.properties, (value) => value?.['x-component'] === 'SubTable');
      state.value = Object.entries(schemas).map(([key, value]) => {
        return {
          label: value?.title,
          value: key,
          schema: value,
        };
      });
    });
    actions.getFieldState('Fields.columns', (state) => {
      const columns = state.initialValue as { title: string; dataIndex: string }[] || [];
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
