import React, { useRef } from 'react';
import { Modal, Form } from '@QCFE/lego-ui';

import Button from '@c/button';

type Props = {
  onCancel: () => void;
  onSubmit: (groupInfo: GroupInfo) => Promise<unknown>;
  name?: string;
  id?: string;
};

function EditGroupModal({ name, id, onCancel, onSubmit }: Props) {
  const ref: any = useRef();
  const handleSubmit = () => {
    const formRef: any = ref.current;
    if (formRef.validateFields()) {
      onSubmit({ ...formRef.getFieldsValue(), id }).then(() => {
        onCancel();
      });
    }
  };

  return (
    <Modal
      visible
      title={id ? '修改分组名称' : '新建分组'}
      onCancel={onCancel}
      footer={
        (<div className="flex items-center">
          <Button className="mr-20" iconName='close' onClick={onCancel}>
            取消
          </Button>
          <Button
            modifier='primary'
            iconName='check'
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
          placeholder='请输入分组名称'
          help='不超过 30 个字符，分组名称不可重复。'
          schemas={[
            {
              help: '请输入分组名称',
              rule: { required: true },
            },
            {
              help: '不能超过30个字符',
              rule: { maxLength: 30 },
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

export default EditGroupModal;
