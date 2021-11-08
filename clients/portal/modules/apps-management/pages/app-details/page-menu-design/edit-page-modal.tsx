import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';

import Modal from '@c/modal';
import { APP_ICON_LIST } from '@c/app-icon-select';

import IconSelected from './icon-selected';
import SelectField from './select-field';
import { fetchGroupList } from '../api';
import store from '../store';

const { TextArea } = Input;

type Props = {
  onCancel: () => void;
  onSubmit: (pageInfo: PageInfo) => void;
  appID: string;
  pageInfo?: PageInfo;
};

type GroupList = {
  id: string;
  name: string;
}

function EditPageModal({ pageInfo, onCancel, onSubmit, appID }: Props): JSX.Element {
  const [groupList, setGroupList] = useState<LabelValue[]>([]);
  const { modalType } = store;
  const [form] = Form.useForm();
  let allPageNames = dataFormat(store.pageInitList).map((pageInfo: PageInfo) => pageInfo.name);

  if (modalType === 'editPage') {
    allPageNames = allPageNames.filter((name) => name !== pageInfo?.name);
  }

  useEffect(() => {
    fetchGroupList(appID).then((res: any) => {
      setGroupList((res.group || []).map(({ id, name }: GroupList) => {
        return { value: id, label: name };
      }));
    });
  }, [appID]);

  function dataFormat(data: PageInfo[]): PageInfo[] {
    const newData: PageInfo[] = [];
    data.map((pageInfo: PageInfo) => {
      if (pageInfo.menuType === 1 && pageInfo.child?.length) {
        const _newData = dataFormat(pageInfo.child);
        newData.push(..._newData);
        return;
      }

      pageInfo.menuType === 0 && newData.push(pageInfo);
      return;
    });
    return newData;
  }

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: any): void {
    onSubmit({ ...(pageInfo || {}), ...values });
  }

  function validateRepeat(value: string): boolean {
    return allPageNames.includes(value);
  }

  const { name, icon, describe, groupID, appID: curAppID } = pageInfo || { icon: APP_ICON_LIST[0] };

  return (
    <Modal
      title={curAppID ? '修改名称与图标' : '新建页面'}
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
      <Form
        className="p-20"
        layout='vertical'
        form={form}
        onFinish={handleFinish}
        initialValues={{
          name: store.modalType === 'copyPage' ? `${name}-副本` : name,
          icon,
          describe,
          groupID,
        }}
      >
        <Form.Item
          name="name"
          label="页面名称"
          extra="不超过 30 个字符，页面名称不可重复。"
          rules={[
            {
              required: true,
              message: '请输入页面名称',
            }, {
              type: 'string',
              message: '名称不超过 30 字符，请修改！ ',
            }, {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                } else if (validateRepeat(value)) {
                  return Promise.reject(new Error('页面名称重复'));
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input placeholder='请输入页面名称' />
        </Form.Item>
        <Form.Item
          name="icon"
          label="显示图标"
          rules={[
            {
              required: true,
              message: '请选择显示图标',
            },
          ]}
        >
          <IconSelected />
        </Form.Item>
        <Form.Item
          name="describe"
          label="描述"
          rules={[
            {
              type: 'string',
              message: '备注超过 100 字符!',
            },
          ]}
        >
          <TextArea placeholder='选填（不超过 100 字符）' />
        </Form.Item>
        {(!curAppID || modalType === 'copyPage') && groupList.length > 0 && (
          <Form.Item name='groupID' label="所属分组">
            <SelectField options={groupList} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default EditPageModal;
