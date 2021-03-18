/**
 * 组件-添加员工
 */
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Modal, Form, Icon } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';
import { Loading } from '@portal/components/Loading';
import SelectTree from '@portal/components/select-tree';
import { IUserInfo } from './PersonInfo';
import { getListRole, addDepUser, getERPTree } from './api';

const { TextField, SelectField, CheckboxGroupField } = Form;

const SelectTreeField = Form.getFormField(SelectTree);

export type FormValues = {
  username: string;
  phone: string;
  email: string;
  roleIDs: string[];
  depIDs: string[];
  id?: string;
};

interface StaffModalProps {
  visible: boolean;
  status: 'add' | 'edit';
  initData: IUserInfo;
  closeModal(): void;
  okModal(values: FormValues): void;
}

export const StaffModal = (props: StaffModalProps) => {
  const { visible, initData, status, closeModal, okModal } = props;
  const [form, setForm] = useState<any>(null);
  const titleText = `${status === 'add' ? '添加' : '修改'}`;

  const { data: roleList, isLoading } = useQuery('getListRole', getListRole, {
    refetchOnWindowFocus: false,
  });
  const { data: depData } = useQuery('getERPTree', getERPTree, {
    refetchOnWindowFocus: false,
  });

  const treeData = depData ? [depData] : [];

  if (isLoading && roleList && depData) {
    return <Loading desc="加载中..." />;
  }

  const okModalHandle = () => {
    const bol = form.validateForm();
    if (!bol) {
      return;
    }
    const values = form.getFieldsValue();
    console.log(values);
    const params: FormValues = {
      ...values,
      depIDs: values.depIDs ? [values.depIDs] : [],
      roleIDs: values.roleIDs ? [values.roleIDs] : [],
    };

    console.log(params);

    okModal(params);
  };

  return (
    <Modal
      title={`${titleText}员工`}
      visible={visible}
      minWidth={632}
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button icon={<Icon name="close" className="mr-dot-4" />} onClick={closeModal}>
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={<Icon name="check" className="mr-dot-4" />}
            onClick={okModalHandle}
          >
            确定{titleText}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={(n) => setForm(n)}>
        <TextField
          name="userName"
          label="员工姓名"
          defaultValue={initData.userName || ''}
          placeholder="请输入 QingCloud 账号"
        />
        <TextField
          name="phone"
          label="手机号码"
          defaultValue={initData.phone || ''}
          placeholder="请输入 QingCloud 账号"
          help="企业成员的真实手机号（手机号/邮箱，两者中至少必填一项）。"
        />
        <TextField
          name="email"
          label="邮箱"
          defaultValue={initData.email || ''}
          placeholder="例如：name@company.com"
          help="企业成员的真实邮箱，设置后可以通过邮箱接收到全象云平台发送的各类消息提醒（手机号/邮箱，两者中至少必填一项）。"
        />
        <SelectTreeField
          name="depIDs"
          label="选择部门"
          placeholder="请选择部门"
          defaultSelect={initData.dep}
          treeData={treeData}
        />
        <SelectField
          name="roleIDs"
          label="角色"
          placeholder="请选择区域"
          defaultValue={''}
          options={
            roleList &&
            roleList.map((role) => ({
              label: role.name,
              value: role.id,
            }))
          }
        />
      </Form>

      {/* <CheckboxGroupField
          name="roleIDs"
          label="向员工发送密码"
          options={[
            {
              label: '通过邮箱',
              value: '1',
            },
            {
              label: '通过短信',
              value: '2',
            },
          ]}
        /> */}
    </Modal>
  );
};
