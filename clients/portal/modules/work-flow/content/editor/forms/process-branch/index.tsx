import React from 'react';
import {
  createFormActions,
  SchemaForm, ISchema,
} from '@formily/antd';

import { Select, Input } from '@formily/antd-components';
import type { ProcessBranchData, NodeType } from '@flowEditor/type';
import Tab from '@c/tab';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';

import FilterRule from './filter-rule';

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
  function onSave(): void {
    actions.getFormState((formState) => {
      onSubmit(formState.values);
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
