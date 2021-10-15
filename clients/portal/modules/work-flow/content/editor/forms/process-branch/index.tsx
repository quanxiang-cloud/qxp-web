import React, { useContext, useMemo } from 'react';
import {
  createFormActions,
  SchemaForm, ISchema,
} from '@formily/antd';

import { Select, Input } from '@formily/antd-components';
import type { ProcessBranchData, NodeType } from '@flow/content/editor/type';
import Tab from '@c/tab';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';
import { getFieldValuePath } from '@flow/content/editor/forms/utils';

import FilterRule from './filter-rule';
import FlowTableContext from '../flow-source-table';

export interface Props {
  nodeType: NodeType;
  defaultValue: ProcessBranchData;
  onSubmit: (data: ProcessBranchData) => void;
  onChange: (data: ProcessBranchData) => void;
  onCancel: () => void;
}

const formSchema: ISchema = {
  type: 'object',
  properties: {
    ignore: {
      type: 'boolean',
      ['x-component']: 'Select',
      'x-rules': {
        required: true,
        message: '请选择筛选条件',
      },
      default: false,
      enum: [{
        label: '自定义条件',
        value: false,
      }, {
        label: 'else 条件',
        value: true,
      }],
      'x-linkages': [
        {
          type: 'value:visible',
          target: 'rule',
          condition: '{{ $value === false }}',
        },
      ],
    },
    rule: {
      type: 'string',
      ['x-component']: 'FilterRule',
      default: '',
    },
  },
};

const actions = createFormActions();

const components = {
  Select,
  FilterRule,
  Input,
};

export default function ProcessBranch({ defaultValue, onSubmit, onCancel, onChange }: Props): JSX.Element {
  const { tableSchema } = useContext(FlowTableContext);
  const formulaFields = useMemo(()=> tableSchema.filter((schema) => {
    return !SYSTEM_FIELDS.includes(schema.fieldName);
  }).reduce((acc: Record<string, string>, field) => {
    const valuePath = getFieldValuePath(field);
    if (valuePath) {
      const { fieldName } = field;
      acc[fieldName] = [fieldName, valuePath].join('.');
    }
    return acc;
  }, {}), [tableSchema]);

  function onSave(): void {
    actions.getFormState((formState) => {
      onSubmit({ ...formState.values, formulaFields });
    });
  }

  function onClose(): void {
    onCancel();
  }

  return (
    <>
      <Tab
        className="mt-10"
        items={[{
          id: 'basicConfig',
          name: '筛选条件',
          content: (
            <div className="mt-24">
              <SchemaForm
                actions={actions}
                initialValues={defaultValue}
                schema={formSchema}
                components={components}
                onChange={(values) => onChange(values)}
              />
            </div>
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onClose} />
    </>
  );
}
