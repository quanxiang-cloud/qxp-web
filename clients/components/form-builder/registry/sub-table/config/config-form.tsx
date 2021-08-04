import React, { useState, useContext, useEffect, useRef } from 'react';
import { update, isUndefined } from 'lodash';
import type { Subscription } from 'rxjs';
import {
  SchemaForm, FormEffectHooks,
} from '@formily/antd';

import configSchema from './config-schema';
import { SubTableConfig } from '../convertor';
import SubTableSchemaConfig from './sub-table-schema-config';
import { COMPONENTS, CONFIG_COMPONENTS, KeyOfConfigComponent } from './constants';

import { StoreContext, ActionsContext } from './context';

interface Props {
  onChange: (value: unknown) => void;
  initialValue: SubTableConfig;
}

const { onFieldValueChange$ } = FormEffectHooks;

export default function ConfigForm({ onChange, initialValue: _initValue }: Props): JSX.Element {
  const [currentFieldKey, setCurrenFieldKey] = useState('');
  const { actions } = useContext(ActionsContext);
  const { appID } = useContext(StoreContext);
  const subRef = useRef<Subscription>();

  useEffect(() => {
    return () => subRef.current?.unsubscribe();
  }, []);

  const initialValue = {
    ..._initValue,
    linkedTable: {
      ..._initValue.linkedTable,
      appID,
    },
  };

  function effects(): void {
    subRef.current = onFieldValueChange$('Fields.curConfigSubTableKey').subscribe(({ value }) => {
      if (!isUndefined(value)) {
        setCurrenFieldKey(value);
      }
    });
  }

  function onFieldConfigValueChange(value: any): void {
    const { subTableSchema } = initialValue;
    update(subTableSchema, `properties.${currentFieldKey}`, (schema) => {
      return {
        ...schema,
        ...CONFIG_COMPONENTS[currentSchemaType as KeyOfConfigComponent]?.toSchema(value),
      };
    });
    actions.setFieldState('Fields.subTableSchema', (state) => state.value = subTableSchema);
    onChange(initialValue);
  }

  function handleChange(value: Record<string, unknown>): void {
    onChange(value);
  }

  const currentSubSchema = initialValue.subTableSchema?.properties?.[currentFieldKey];
  const currentSchemaType = currentSubSchema?.['x-component']?.toLowerCase() as KeyOfConfigComponent;

  return (
    <ActionsContext.Provider value={{ actions }}>
      <SchemaForm
        initialValues={initialValue}
        components={COMPONENTS}
        onChange={(value) => handleChange(value)}
        schema={configSchema}
        actions={actions}
        hidden={!!currentSubSchema}
        effects={effects}
      />
      <SubTableSchemaConfig
        currentSubSchema={currentSubSchema}
        currentSchemaType={currentSchemaType}
        onChange={onFieldConfigValueChange}
        subTableSchema={initialValue.subTableSchema}
      />
    </ActionsContext.Provider>
  );
}
