import React from 'react';
import { Input, Form } from 'antd';

import Modal from '@c/modal';

// import toast from '@lib/toast';

import store from './store';
import ButtonField from './button-field';
// import { validateTemplateName } from './api';
import { DISABLE_SPECIAL_SYMBOL_REG } from '../pages/entry/app-list/app-edit/created-edit-app';
// import AppIconPicker from '../../app-list/app-edit/app-icon-picker';

type Props = {
  modalType: string;
  templateInfo: TemplateInfo | undefined;
  onCancel: () => void;
}

const { TextArea } = Input;

function EditProjectModal({ modalType, templateInfo, onCancel }: Props): JSX.Element {
  const [form] = Form.useForm();
  const isEdit = modalType === 'editTemplate';
  const { addTemplate, editTemplate } = store;

  async function handleSubmit(): Promise<void> {
    const { name, icon } = form.getFieldsValue();

    if (isEdit) {
      await editTemplate(templateInfo?.id || '', name, icon);
      return onCancel();
    }

    // validateTemplateName(name).then(() => {
    //   return addTemplate({ ...templateInfo, name, appIcon: icon });
    // }).then(() => {
    //   onCancel();
    // }).catch(() => toast.error('模版名称校验失败')).finally(store.fetchList);
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
      <div className="px-20 py-16 text-12">
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            name: templateInfo?.name,
            icon: templateInfo?.appIcon,
          }}
        >
          <Form.Item
            name="name"
            label='项目组'
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
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item
            name="member"
            label="项目组成员"
            rules={[
              { required: true, message: '请选择人员' },
            ]}
          >
            <ButtonField />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ max: 100, message: '输入超过 100 字符' }]}
            // initialValue={msgApiKey?.description}
          >
            <TextArea placeholder="选填(不超过 100 字符)"/>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default EditProjectModal;
