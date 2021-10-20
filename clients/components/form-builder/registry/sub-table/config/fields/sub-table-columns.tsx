import React, { useState, useEffect, useContext, useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useFormEffects, FormEffectHooks, IFieldState } from '@formily/antd';

import Toggle from '@c/toggle';

import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import schemaToFields from '@lib/schema-convert';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';
import { getTableSchema } from '@lib/http-client';

import { SUPPORTED_COMPONENTS_NAMES } from '../constants';

const { onFieldValueChange$ } = FormEffectHooks;

interface Option {
  label: string;
  value: string;
}

function SubTableColumns({ value, mutators }: ISchemaFieldComponentProps): JSX.Element {
  const [currentSchema, setCurrentSchema] = useState<ISchema>();
  const { actions } = useContext(FieldConfigContext);
  const subRef = useRef<any>();

  useEffect(() => {
    !currentSchema && actions.getFieldState('Fields.linkedTable', handleLinkedTableChange);
    return () => subRef.current?.unsubscribe();
  }, []);

  function handleLinkedTableChange(state: IFieldState): void {
    const { tableID, appID } = state.value || {};
    fetchSchema(tableID, appID);
  }

  function fetchSchema(tableID: string, appID: string): void {
    actions.getFieldState('Fields.subordination', async (st) => {
      if (tableID && appID && st.value === 'foreign_table') {
        const resp = await getTableSchema(appID, tableID);
        if (resp?.schema) {
          setCurrentSchema(resp.schema);
        }
      }
    });
  }

  useFormEffects(() => {
    subRef.current = onFieldValueChange$('Fields.linkedTable').subscribe(handleLinkedTableChange);
  });

  const schemaOptions = schemaToFields(currentSchema).reduce((cur: Option[], field) => {
    if (field.id !== '_id' && !INTERNAL_FIELD_NAMES.includes(field.id) &&
      SUPPORTED_COMPONENTS_NAMES.includes(field.componentName)) {
      cur.push({
        label: field.title as string,
        value: field.id,
      });
    }
    return cur;
  }, []);

  function onToggleColumn(key: string, checked: boolean): void {
    let newValue = checked ? [...value, key] : value.filter((k: string) => k !== key);
    newValue = [...new Set(['_id', ...newValue])];
    mutators.change(newValue);
  }

  return (
    <div className="w-full">
      <header className="flex justify-between items-center bg-gray-50 mb-16">
        <div className="mr-10">子表字段</div>
      </header>
      {!!schemaOptions.length && (
        <ul className="flex w-full flex-col py-12 px-28 border rounded">
          {schemaOptions.map(({ label, value: val }) => {
            return (
              <li key={val} className="flex justify-between items-center my-5">
                <span className="mr-7">{label}</span>
                <Toggle
                  defaultChecked={value.includes(val)}
                  onChange={(isOpen) => onToggleColumn(val, isOpen)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

SubTableColumns.isFieldComponent = true;

export default SubTableColumns;
