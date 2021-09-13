import React, { useContext } from 'react';

import FlowSourceTableContext from '../flow-source-table';

export const availableVariableCtx = React.createContext<ProcessVariable[]>([]);

export const ConfigSchema = {
  type: 'object',
  properties: {
    assignmentRules: {
      type: 'array',
      'x-component': 'RulesList',
      items: {
        type: 'object',
        properties: {
          variableName: {
            type: 'string',
            'x-component': 'AntdSelect',
            readOnly: true,
            // enum: variables.map(({ code, name }) => ({ label: name, value: code })),
          },
          valueFrom: {
            type: 'string',
            'x-component': 'AntdSelect',
            enum: [
              { label: '表单值', value: 'currentFormValue' },
              { label: '固定值', value: 'fixedValue' },
            ],
          },
          valueOf: {
            type: 'string',
            'x-component': 'AntdSelect',
          },
        },
      },
    },
  },
};

const ASSIGNABLE_COMPONENTS = [
  'Input',
  'Textarea',
  'RadioGroup',
  'CheckboxGroup',
  'NumberPicker',
  'DatePicker',
  'Select',
  'MultipleSelect',
  'UserPicker',
  'OrganizationPicker',
  'CascadeSelector',
];

export function useTableFieldOptions(): Array<LabelValue & { type: string; }> {
  const { tableSchema } = useContext(FlowSourceTableContext);
  return tableSchema.filter((schema) => {
    return ASSIGNABLE_COMPONENTS.includes(schema['x-component'] || '');
  }).map((schema) => {
    return {
      label: schema.title as string,
      value: schema.id,
      type: schema.type || '',
    };
  });
}
