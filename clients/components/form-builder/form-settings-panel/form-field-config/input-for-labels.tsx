import React from 'react';
import { Input } from 'antd';
import { SchemaForm, FormButtonGroup, IForm, createFormActions } from '@formily/antd';

import Modal from '@c/modal';
import Button from '@c/button';

const TextArea = Input.TextArea;

type Props = {
  form: IForm;
  defaultValue: string;
  isLinkedFieldHide?: boolean;
  isLinkedTableReadonly?: boolean;
  onClose: () => void;
  onSubmit: (labels: string[]) => void;
}

function OptionLabels({ defaultValue, onClose, onSubmit }: Props): JSX.Element {
  const actions = createFormActions();

  return (
    <Modal
      title="编辑多项"
      className="edit-labels"
      onClose={onClose}
    >
      <SchemaForm
        className="p-20"
        actions={actions}
        schema={{
          type: 'object',
          properties: {
            optionLabels: {
              type: 'string',
              'x-component': 'TextArea',
              description: '每行为一个选项，且选项不能超过 15 个字符',
              'x-component-props': {
                style: {
                  height: '150px',
                },
              },
            },
          },
        }}
        components={{ TextArea }}
        defaultValue={{ optionLabels: defaultValue }}
        onSubmit={(values) => onSubmit(values.optionLabels.split(/\r?\n/).map((label: any) => {
          return label.trim().slice(0, 15);
        }).filter(Boolean))}
      >
        <FormButtonGroup offset={8}>
          <Button type="submit" modifier="primary">保存</Button>
          <Button type="submit" onClick={onClose}>关闭</Button>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  );
}

export default OptionLabels;
