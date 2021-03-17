/**
 * 组件-添加员工
 */
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Modal, Form } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';
import { Loading } from '@portal/components/Loading';
import { getListRole, addDepUser } from './api';

const { TextField, SelectField, CheckboxGroupField } = Form;

export type FormValues = {
  username: string;
  phone: string;
  email: string;
  roleIDs: string[];
  depIDs: string | string[];
};

interface StaffModalProps {
  visible: boolean;
  status: 'add' | 'edit';
  closeModal(): void;
  okModal(values: FormValues): void;
}

export const StaffModal = (props: StaffModalProps) => {
  const { visible, closeModal, okModal } = props;
  const [form, setForm] = useState<any>(null);

  const { data: roleList, isLoading } = useQuery('getListRole', getListRole);
  console.log(roleList);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  const titleText = `${status === 'add' ? '添加员工' : '修改员工信息'}`;

  const okModalHandle = () => {
    const bol = form.validateForm();
    if (!bol) {
      return;
    }
    const values = form.getFieldsValue();
    const params: FormValues = {
      ...values,
      depIDs: values.depIDs ? [values.depIDs] : [],
    };
    okModal(params);
  };

  return (
    <Modal
      title={`${titleText}部门`}
      visible={true}
      minWidth={632}
      onCancel={closeModal}
      // onOk={okModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 px-dot-4"
                src="./dist/images/icon_error.svg"
                alt="icon_error"
              />
            }
            onClick={closeModal}
          >
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 px-dot-4"
                src="./dist/images/icon_true.svg"
                alt="icon_true"
              />
            }
            onClick={okModalHandle}
          >
            确定{titleText}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={(n) => setForm(n)}>
        <TextField name="userName" label="员工姓名" placeholder="请输入 QingCloud 账号" />
        <TextField
          name="phone"
          label="手机号码"
          placeholder="请输入 QingCloud 账号"
          help="企业成员的真实手机号（手机号/邮箱，两者中至少必填一项）。"
        />
        <TextField
          name="email"
          label="邮箱"
          placeholder="例如：name@company.com"
          help="企业成员的真实邮箱，设置后可以通过邮箱接收到全象云平台发送的各类消息提醒（手机号/邮箱，两者中至少必填一项）。"
        />
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
        <SelectField
          name="depIDs"
          label="部门"
          placeholder="请选择区域"
          style={{ width: '100%' }}
          options={[
            { label: '全象应用平台', value: 'f5a5d3a8-157e-4b04-90e0-07ba5950ee7a' },
            { label: '部门1', value: '5ad55834-a03e-4705-9214-edd5de15cf7c' },
            { label: '部门2', value: '5ad55834-a03e-4705-9214-edd5de15cf7c' },
          ]}
        />
        <SelectField
          name="roleIDs"
          multi
          label="角色"
          placeholder="请选择区域"
          defaultValue={[0]}
          options={
            roleList &&
            roleList.map((role) => ({
              label: role.name,
              value: role.id,
            }))
          }
        />
      </Form>
    </Modal>
  );
};
