import React, { useRef } from 'react';
import { Modal, Form } from '@QCFE/lego-ui';

import Button from '@appC/button';
import SelectField from '@appC/select-field';
import IconSelect from '@appC/icon-select';

type Props = {
  onCancel: () => void;
  onSubmit: any;
  pageInfo?: PageInfo;
};

const IconSelectField = Form.getFormField(IconSelect);

function EditPageModal({ pageInfo, onCancel, onSubmit }: Props) {
  const ref: any = useRef();
  const handleSubmit = () => {
    const formRef: any = ref.current;
    if (formRef.validateFields()) {
      onSubmit({ ...(pageInfo || {}), ...formRef.getFieldsValue() });
    }
  };

  const { name, icon, describe, groupID, appID } = pageInfo || {};

  return (
    <Modal
      visible
      className="static-modal"
      title={appID ? '修改名称与图标' : '新建页面'}
      onCancel={onCancel}
      footer={
        (<div className="flex items-center">
          <Button icon='close' onClick={onCancel}>
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            isPrimary
            icon='check'
            onClick={handleSubmit}
          >
            确定
          </Button>
        </div>)
      }>
      <Form layout='vertical' ref={ref}>
        <Form.TextField
          name='name'
          defaultValue={name}
          label='页面名称'
          placeholder='请输入页面名称'
          help='不超过 30 个字符，页面名称不可重复。'
          schemas={[
            {
              help: '请输入页面名称',
              rule: { required: true },
            },
            {
              help: '名称不超过 30 字符，请修改！ ',
              rule: { maxLength: 30 },
            },
          ]}
        />
        <IconSelectField
          name='icon'
          label='显示图标'
          defaultValue={icon}
          schemas={[
            {
              help: '请选择显示图标',
              rule: { required: true },
            },
          ]}
          options={[
            { value: 'toggle_on' },
            { value: 'settings' },
            { value: 'login' },
            { value: 'restore_from_trash' },
          ]}
        />
        <Form.TextAreaField
          name='describe'
          defaultValue={describe}
          label='描述'
          placeholder='选填（不超过 100 字符）'
          schemas={[
            {
              help: '备注超过 100 字符!',
              rule: { maxLength: 100 },
            },
          ]}
        />
        <SelectField
          name='groupID'
          defaultValue={groupID}
          label='所属分组'
          placeholder='选填'
          options={[
            { value: 'range-1', label: '地址范围：172.31.36.200 ~ 215' },
            { value: 'range-2', label: '地址范围：172.31.36.200 ~ 240' },
          ]}
        />
      </Form>
    </Modal>
  );
}

export default EditPageModal;
