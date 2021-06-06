import React, { useState, useEffect, useContext, useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useFormEffects, FormEffectHooks, IFieldState } from '@formily/antd';

import Toggle from '@c/toggle';

import { getFormTableSchema } from '../api';
import { BLOCKED_FIELD_NAMES, SUPPORTED_COMPONENTS_NAMES } from '../constants';
import { ActionsContext } from '../context';

const { onFieldValueChange$ } = FormEffectHooks;

interface Option {
  label: string;
  value: string;
  schema: ISchema;
}

function SubTableColumns({ value, mutators }: ISchemaFieldComponentProps) {
  const [currentSchema, setCurrentSchema] = useState<ISchema>();
  const { actions } = useContext(ActionsContext);
  const subRef = useRef<any>();

  useEffect(() => {
    if (!currentSchema && value?.length) {
      actions.getFieldState('Fields.linkedTable', handleLinkedTableChange);
    }
  }, []);

  useEffect(() => {
    return () => subRef.current?.unsubscribe();
  });

  function handleLinkedTableChange(state: IFieldState) {
    const { tableID, appID } = state.value || {};
    fetchSchema(tableID, appID);
  }

  function fetchSchema(tableID: string, appID: string) {
    actions.getFieldState('Fields.subordination', async (st) => {
      if (tableID && appID && st.value === 'foreign_table') {
        const resp = await getFormTableSchema<{
            schema: ISchema;
            tableID: string;
            tableName: string;
          }>({ tableID, appID });
        if (resp?.schema) {
          setCurrentSchema(resp.schema);
        }
      }
    });
  }

  useFormEffects(() => {
    subRef.current = onFieldValueChange$('Fields.linkedTable').subscribe(handleLinkedTableChange);
  });

  const schemaOptions = Object.entries(currentSchema?.properties || {}).reduce((cur: Option[], next) => {
    const [key, sc] = next;
    if (key !== '_id' && !BLOCKED_FIELD_NAMES.includes(key) &&
      SUPPORTED_COMPONENTS_NAMES.includes(sc['x-component']?.toLocaleLowerCase() || '')) {
      cur.push({
        label: sc.title as string,
        value: key,
        schema: sc,
      });
    }
    return cur;
  }, []);

  function onToggleColumn(key: string, checked: boolean) {
    let newValue = [];
    if (!checked) {
      newValue = value.filter((k: string) => k !== key);
    } else {
      newValue = [...value, key];
    }
    mutators.change([...new Set(['_id', ...newValue])]);
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
