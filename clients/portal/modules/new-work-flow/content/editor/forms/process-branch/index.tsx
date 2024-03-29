/* eslint-disable no-nested-ternary */
import React, { useContext, useMemo } from 'react';
import {
  createFormActions,
  SchemaForm, ISchema,
} from '@formily/antd';

import { Select, Input } from '@formily/antd-components';
import type { ProcessBranchData, NodeType, StoreValue } from '@newFlow/content/editor/type';
import Tab from '@c/tab';
import SaveButtonGroup from '@newFlow/content/editor/components/_common/action-save-button-group';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';
import { getFieldValuePath } from '@newFlow/content/editor/forms/utils';

import FilterRule from './filter-rule';
import FlowTableContext from '../flow-source-table';
import useObservable from '@lib/hooks/use-observable';
import store from '../../store';

interface Props {
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

const noElseFormSchema: ISchema = {
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
  const { elements, nodeIdForDrawerForm } = useObservable<StoreValue>(store);
  const curNode = elements?.find((item: any)=>item?.id === nodeIdForDrawerForm);
  const parentNode = elements?.find((item: any)=>item?.id === curNode?.data?.nodeData?.parentID?.[0]);
  const siblingsNodeID = parentNode?.data?.nodeData?.childrenID;
  const siblingsNode = elements?.filter((item: any)=>siblingsNodeID?.includes(item?.id));
  let hasElseBranch = false;
  siblingsNode?.forEach((item: any)=>{
    if (item?.data?.businessData?.ignore) {
      hasElseBranch = true;
    }
  });
  const formulaFields = useMemo(()=> tableSchema.filter((schema) => {
    return !SYSTEM_FIELDS.includes(schema.fieldName);
  })?.reduce((acc: Record<string, string>, field) => {
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

  const handleChange = (values: any) => {
    onChange(values);
  };

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
                schema={hasElseBranch ? (defaultValue?.ignore ? formSchema : noElseFormSchema) : formSchema}
                components={components}
                onChange={handleChange}
              />
            </div>
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onClose} />
    </>
  );
}
