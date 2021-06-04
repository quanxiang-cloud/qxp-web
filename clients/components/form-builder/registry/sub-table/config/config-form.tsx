import React, { useState, useContext } from 'react';
import { update } from 'lodash';
import {
  SchemaForm, FormEffectHooks,
} from '@formily/antd';

import configSchema from './config-schema';
import { SubTableConfig } from '../convertor';
import SubTableSchemaConfig from './sub-table-schema-config';
import { COMPONENTS, CONFIG_COMPONENTS } from './constants';

import { StoreContext, ActionsContext } from './context';

interface Props {
  onChange: (value: any) => void;
  initialValue: SubTableConfig;
}

const { onFieldValueChange$ } = FormEffectHooks;

export default function ConfigForm({ onChange, initialValue: _initValue }: Props) {
  const [currentFieldKey, setCurrenFieldKey] = useState('');
  const { actions } = useContext(ActionsContext);
  const { appID } = useContext(StoreContext);

  const initialValue = {
    ..._initValue,
    linkedTable: {
      ..._initValue.linkedTable,
      appID,
    },
  };

  function effects() {
    onFieldValueChange$('Fields.curConfigSubTableKey').subscribe(({ value }) => {
      value && setCurrenFieldKey(value);
    });
  }

  function onFieldConfigValueChange(value: any) {
    const { subTableSchema } = initialValue;
    update(subTableSchema, `properties.${currentFieldKey}`, (schema) => ({
      ...schema,
      ...CONFIG_COMPONENTS[currentSchemaType]?.toSchema(value),
    }));
    actions.setFieldState('Fields.subTableSchema', (state) => state.value = subTableSchema);
  }

  const currentSubSchema = initialValue.subTableSchema?.properties?.[currentFieldKey];
  const currentSchemaType = currentSubSchema?.['x-component']?.toLowerCase() as string;

  return (
    <ActionsContext.Provider value={{ actions }}>
      <SchemaForm
        initialValues={initialValue}
        components={COMPONENTS}
        onChange={onChange}
        schema={configSchema}
        actions={actions}
        hidden={!!currentSubSchema}
        effects={effects}
      />
      <SubTableSchemaConfig
        currentSubSchema={currentSubSchema}
        currentSchemaType={currentSchemaType}
        onChange={onFieldConfigValueChange}
      />
    </ActionsContext.Provider>
  );
}
