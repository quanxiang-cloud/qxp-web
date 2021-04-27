import React, { useRef, useEffect, useState } from 'react';
import { Modal, Form } from '@QCFE/lego-ui';

import Button from '@c/button';
import SelectField from '@appC/select-field';
import { fetchGroupList } from '@appLib/api';
import AppIconSelect from '@c/app-icon-select';

type Props = {
  onCancel: () => void;
  onSubmit: any;
  appID: string;
  pageInfo?: PageInfo;
};

type GroupList = {
  id: string;
  name: string;
}

type Option = {
  value: string;
  label: string;
}

const IconSelectField = Form.getFormField(AppIconSelect);

function EditPageModal({ pageInfo, onCancel, onSubmit, appID }: Props) {
  const [groupList, setGroupList] = useState<Option[]>([]);

  useEffect(() => {
    fetchGroupList(appID).then((res) => {
      setGroupList((res.data.group || []).map(({ id, name }: GroupList) => {
        return { value: id, label: name };
      }));
    });
  }, [appID]);

  const ref: any = useRef();
  const handleSubmit = () => {
    const formRef: any = ref.current;
    if (formRef.validateFields()) {
      onSubmit({ ...(pageInfo || {}), ...formRef.getFieldsValue() });
    }
  };

  const { name, icon, describe, groupID, appID: curAppID } = pageInfo || {};

  return (
    <Modal
      visible
      className="static-modal"
      title={curAppID ? '修改名称与图标' : '新建页面'}
      onCancel={onCancel}
      footer={
        (<div className="flex items-center">
          <Button iconName='close' onClick={onCancel}>
            取消
          </Button>
          <div className="px-2"></div>
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
        {!curAppID && (
          <SelectField
            name='groupID'
            defaultValue={groupID}
            label='所属分组'
            placeholder='选填'
            options={groupList}
          />
        )}
      </Form>
    </Modal>
  );
}

export default EditPageModal;
