import React, { useState } from 'react';
// import { omit, omitBy } from 'lodash';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useFormEffects, FormEffectHooks } from '@formily/antd';

import Toggle from '@c/toggle';

import { BLOCKED_FIELD_NAMES } from '../constants';
const { onFieldValueChange$ } = FormEffectHooks;
// import { ActionsContext, StoreContext } from '../context';
// import { getFormTableSchema } from '../api';

interface Option {
  label: string;
  value: string;
  schema: ISchema;
}

function Columns({ value, mutators }: ISchemaFieldComponentProps) {
  const [schemaOptions, setSchemaOptions] = useState<Option[]>([]);

  useFormEffects(() => {
    onFieldValueChange$('Fields.linkedTable', () => {

    });
  });

  // actions.setFieldState('Fields.workTableSchemaOptions', (state) => {
  //   const schemas = omitBy(schema.properties, (value) => value?.['x-component'] === 'SubTable');
  //   state.value = Object.entries(schemas).map(([key, value]) => {
  //     return {
  //       label: value?.title,
  //       value: key,
  //       schema: value,
  //     };
  //   });
  // });
  // actions.getFieldState('Fields.subordination', (state) => {
  //   actions.getFieldState('Fields.columns', (st) => {
  //     const columns = st.value as {title: string; dataIndex: string}[];
  //     const cols = columns.map(({ dataIndex }) => dataIndex);
  //     let properties = {};
  //     if (state.value === 'foreign_table') {
  //       properties = Object.entries(schema.properties || {}).reduce(
  //         (cur: SchemaProperties, next: [string, ISchema]) => {
  //           const [key, sc] = next;
  //           if (cols.includes(key)) {
  //             cur[key] = sc;
  //           }
  //           return cur;
  //         }, {});
  //     }
  //     actions.setFieldState('Fields.items', (state) => {
  //       state.value = {
  //         type: 'object',
  //         properties,
  //       };
  //     });
  //   });
  // });
  // const { schema, tableID, tableName } = await getFormTableSchema<{
  //   schema: ISchema;
  //   tableID: string;
  //   tableName: string;
  // }>(omit(newValue, 'tableName')) || {};
  // if (schema?.properties) {
  //   updateAvailableSchema(schema);
  // }

  // function onToggleFields({ label, value, schema }: {
  //   label: string;
  //   value: string;
  //   schema: ISchema;
  // }, isOpen: boolean) {
  //   if (isOpen) {
  //     return onUpdateFields(([...schemaList, { label, schema, value, sort: getIndex() }]));
  //   }
  //   onUpdateFields(schemaList.filter(({ value: val }) => value !== val));
  // }

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
          .map(({ label, value, schema }) => {
            const isChecked = !!schemaList.find(({ value: v }) => value === v);
            return (
              <li key={value} className="flex justify-between items-center my-5">
                <span className="mr-7">{label}</span>
                <Toggle
                  defaultChecked={isChecked}
                  onChange={(isOpen) => onToggleFields({ label, value, schema }, isOpen)}
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
