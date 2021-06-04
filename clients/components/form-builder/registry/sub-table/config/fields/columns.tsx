import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useFormEffects, FormEffectHooks } from '@formily/antd';

import Toggle from '@c/toggle';

import { getFormTableSchema } from '../api';
import { BLOCKED_FIELD_NAMES } from '../constants';

const { onFieldValueChange$ } = FormEffectHooks;

interface Option {
  label: string;
  value: string;
  schema: ISchema;
}

function Columns({ value, mutators }: ISchemaFieldComponentProps) {
  const [currentSchema, setCurrentSchema] = useState<ISchema>();

  useFormEffects(($, { getFieldState }) => {
    onFieldValueChange$('Fields.linkedTable').subscribe((state) => {
      const { tableID, appID } = state.value;
      getFieldState('Fields.subordination', async (st) => {
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
    });
  });

  const schemaOptions = Object.entries(currentSchema?.properties || {}).reduce((cur: Option[], next) => {
    const [key, sc] = next;
    cur.push({
      label: sc.title as string,
      value: key,
      schema: sc,
    });
    return cur;
  }, []);

  function onToggleColumn(key: string, checked: boolean) {
    if (!checked) {
      return mutators.change(value.filter((k: string) => k !== key));
    }
    mutators.change([...value, key]);
  }

  return (
    <div>
      <header className="flex justify-between items-center bg-gray-50 mb-16">
        <div className="mr-10">子表字段</div>
      </header>
      <ul className="flex flex-col py-12 px-28 border rounded h-280 overflow-y-scroll">
        {schemaOptions
          .filter(({ value, schema }) => {
            return value !== '_id' && !BLOCKED_FIELD_NAMES.includes(
              schema?.['x-component']?.toLowerCase() || ''
            );
          })
          .map(({ label, value }) => {
            return (
              <li key={value} className="flex justify-between items-center my-5">
                <span className="mr-7">{label}</span>
                <Toggle
                  defaultChecked={value.includes(value)}
                  onChange={(isOpen) => onToggleColumn(value, isOpen)}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

Columns.isFieldComponent = true;

export default Columns;
