import React from 'react';
import { Input, Form } from 'antd';

import Icon from '@c/icon';
import Modal from '@c/modal';
import toast from '@lib/toast';

import store from '../store';
import { validateTemplateName } from '../api';
import AppIconPicker from '../../app-list/app-edit/app-icon-picker';
import { DISABLE_SPECIAL_SYMBOL_REG } from '../../app-list/app-edit/created-edit-app';

type Props = {
  modalType: string;
  templateInfo: TemplateInfo;
  onCancel: () => void;
}

function EditTemplateModal({ modalType, templateInfo, onCancel }: Props): JSX.Element {
  const [form] = Form.useForm();
  const isEdit = modalType === 'editTemplate';
  const { addTemplate, editTemplate } = store;

  async function handleSubmit(): Promise<void> {
    const { name, icon } = form.getFieldsValue();

    if (isEdit) {
      await editTemplate(templateInfo.id, name, icon);
      return onCancel();
    }

    validateTemplateName(name).then(async () => {
      await addTemplate({ ...templateInfo, name, appIcon: icon });
      onCancel();
    }).catch(() => toast.error('模版名称校验失败'));
  }

  return (
    <Modal
      title={isEdit ? '修改模版信息' : '确定保存为模版'}
      onClose={onCancel}
      className="static-modal text-12"
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: onCancel,
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
          text: isEdit ? '确定修改' : '确定保存',
        },
      ]}
    >
      <div className="flex-1 p-20">
        <p className="mb-8 bg-gray-50 px-16 py-8 text-blue-600 rounded-12 rounded-tl-4 flex items-center">
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='info' />
          模版不包含应用数据，{!isEdit && '且保存为模版后，'}对模版的修改不会影响应用
        </p>
        <div className="px-20 py-16 text-12">
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              name: templateInfo.name,
              icon: templateInfo.appIcon,
            }}
          >
            <Form.Item
              name="name"
              label='模版名称'
              rules={[
                {
                  required: true,
                  message: '请输入应用名称',
                },
                {
                  pattern: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/,
                  message: '不能输入emoji表情符号',
                },
                {
                  type: 'string',
                  max: 30,
                  message: '不能超过 30 个字符',
                },
                {
                  validator: (rule, value) => {
                    if (!value) {
                      return Promise.resolve();
                    } else if (DISABLE_SPECIAL_SYMBOL_REG.test(value)) {
                      return Promise.reject(new Error('不能包含特殊字符'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input placeholder="请输入应用名称" />
            </Form.Item>
            <Form.Item
              name="icon"
              label="模版图标:"
              rules={[
                {
                  required: true,
                  message: '请选择应用图标',
                },
              ]}
            >
              <AppIconPicker />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
}

export default EditTemplateModal;
