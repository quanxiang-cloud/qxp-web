import React from 'react';
import { toJS } from 'mobx';
import SchemaForm, { useForm } from '@formily/antd';
import { Input } from '@formily/antd-components';

import Modal from '@c/modal';

import store from '../store';

type Props = {
  modalType: string;
  onClose: () => void;
  handleEditModel: (modalInfo: DataModelBasicInfo) => void;
}

function EditModal({ modalType, onClose, handleEditModel }: Props): JSX.Element {
  const modelInfo = modalType === 'create' ? null : toJS(store.curDataModel);
  const SCHEMA: ISchema = {
    type: 'object',
    properties: {
      Fields: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          title: {
            type: 'string',
            title: '数据模型名称',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入数据模型名称',
            },
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入模型名称',
              },
              {
                max: 30,
                message: '名称不超过 30 字符，请修改！',
              },
              {
                validator: validateTitleRepeat,
                message: '模型名称重复',
              },
            ],
            'x-index': 0,
          },
          tableID: {
            type: 'string',
            title: '标识',
            editable: !modelInfo || modalType === 'copy',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入数据模型标识',
            },
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入模型编码',
              },
              {
                max: 30,
                message: '字段标识不超过 30 字符，请修改！',
              },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message: '必须以字母开头,由字母、数字、下划线组成',
              },
              {
                validator: validateTableIDRepeat,
                message: '模型标识重复',
              },
            ],
            'x-index': 1,
          },
          description: {
            type: 'string',
            title: '描述',
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '选填（不超过 100 字符）',
            },
            'x-mega-props': {
              labelAlign: 'top',
            },
            'x-rules': {
              max: 100,
              message: '备注超过 100 字符!',
            },
            'x-index': 2,
          },
        },
      },
    },
  };
  const form = useForm({
    initialValues: {
      title: modalType === 'copy' ? `${modelInfo?.title}-副本` : modelInfo?.title,
      tableID: modalType === 'copy' ? '' : modelInfo?.tableID.split('_').pop(),
      description: modelInfo?.description,
    },
    onSubmit: (formData) => {
      handleEditModel(formData);
    },
  });

  function handleSubmit(): void {
    form.submit().then(() => {
      onClose();
    }).catch(() => null);
  }

  function validateTitleRepeat(value: string): boolean {
    let repeated = false;
    for (const modalInfoTmp of toJS(store.dataModels)) {
      if (modalType === 'edit' && value === modelInfo?.title) {
        continue;
      }

      if (value === modalInfoTmp.title) {
        repeated = true;
      }
    }

    return repeated;
  }

  function validateTableIDRepeat(value: string): boolean {
    let repeated = false;
    for (const modalInfoTmp of toJS(store.dataModels)) {
      if (modalType === 'edit' && value === modelInfo?.tableID) {
        continue;
      }

      if (value === modalInfoTmp.tableID.split('_').pop()) {
        repeated = true;
      }
    }

    return repeated;
  }

  return (
    <Modal
      className="static-modal"
      title={`${modalType === 'edit' ? '修改' : '添加'}数据模型`}
      onClose={onClose}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onClose,
        },
        {
          text: `${modalType === 'edit' ? '确定修改' : '确定添加'}`,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <SchemaForm
        className="p-20"
        schema={SCHEMA}
        form={form as any}
        components={{ Input, TextArea: Input.TextArea }}
      />
    </Modal>
  );
}

export default EditModal;
