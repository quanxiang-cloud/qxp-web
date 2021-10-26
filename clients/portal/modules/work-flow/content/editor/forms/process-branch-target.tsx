import React from 'react';
import {
  createFormActions,
  SchemaForm, ISchema,
} from '@formily/antd';

import { Radio } from '@formily/antd-components';
import type { ProcessBranchTargetData, NodeType } from '@flow/content/editor/type';
import Tab from '@c/tab';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';

export interface Props {
  nodeType: NodeType;
  defaultValue: ProcessBranchTargetData;
  onSubmit: (data: ProcessBranchTargetData) => void;
  onCancel: () => void;
}

const actions = createFormActions();

const formSchema: ISchema = {
  type: 'object',
  properties: {
    processBranchEndStrategy: {
      type: 'string',
      title: '流程结束策略',
      ['x-component']: 'RadioGroup',
      'x-rules': {
        required: true,
        message: '请选择流程结束策略',
      },
      default: 'any',
      enum: [{
        label: '任一分支拒绝则结束本流程',
        value: 'any',
      }, {
        label: '所有分支都拒绝时结束本流程',
        value: 'all',
      }],
    },
  },
};

const components = { RadioGroup: Radio.Group };

export default function ProcessBranchTarget(props: Props): JSX.Element {
  const { defaultValue, onCancel, onSubmit } = props;

  function onSave(): void {
    actions.getFormState((state) => {
      onSubmit(state.values);
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
          name: '合流',
          content: (
            <div className="mt-24">
              <SchemaForm
                actions={actions}
                initialValues={defaultValue}
                schema={formSchema}
                components={components}
              />
            </div>
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onClose} />
    </>
  );
}
