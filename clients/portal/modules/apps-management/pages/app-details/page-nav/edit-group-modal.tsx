import React, { useRef } from 'react';
import { Form } from '@QCFE/lego-ui';

import Modal from '@c/modal';

import store from '../store';

type Props = {
  onCancel: () => void;
  onSubmit: (groupInfo: PageInfo) => Promise<unknown>;
  name?: string;
  id?: string;
};

function EditGroupModal({ name, id, onCancel, onSubmit }: Props) {
  const ref: any = useRef();
  const handleSubmit = () => {
    const formRef = ref.current;
    if (formRef.validateFields()) {
      onSubmit({ ...formRef.getFieldsValue(), id }).then(() => {
        onCancel();
      });
    }
  };

  const validateRepeat = (value: string) => {
    return store.pageInitList.findIndex((pageInfo: PageInfo) => {
      if (pageInfo.menuType === 1 ) {
        return pageInfo.name === value;
      }
    }) === -1;
  };

  return (
    <Modal
      title={id ? '修改分组名称' : '新建分组'}
      onClose={onCancel}
      footerBtns={[{
        key: 'close',
        iconName: 'close',
        onClick: onCancel,
        text: '取消',
      }, {
        key: 'check',
        iconName: 'check',
        modifier: 'primary',
        onClick: handleSubmit,
        text: '确定',
      }]}
    >
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
            {
              rule: validateRepeat,
              help: '分组名称重复',
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

export default EditGroupModal;
