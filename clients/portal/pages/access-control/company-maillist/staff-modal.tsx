/**
 * 组件-添加员工
 */
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Modal, Form, Icon } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import { Loading } from '@portal/components/loading2';
import SelectTree from '@portal/components/select-tree';
import { IUserInfo } from './person-info';
import { getListRole, addDepUser, getERPTree, getUserRole } from './api';

const { TextField, SelectField, CheckboxGroupField } = Form;

const SelectTreeField = Form.getFormField(SelectTree);

export type FormValues = {
  userName: string;
  phone: string;
  email: string;
  roleIDs: string[];
  depIDs: string[];
  id?: string;
  sendEmailMsg?: 1 | -1;
  sendPhoneMsg?: 1 | -1;
};

export type EditFormValues = {
  userName: string;
  phone: string;
  email: string;
  delete: string[];
  add: string[];
  depIDs: string[];
  id?: string;
};

interface StaffModalProps {
  visible: boolean;
  status: 'add' | 'edit';
  initData: IUserInfo;
  closeModal(): void;
  okModal(values: FormValues | EditFormValues): void;
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

  // const mutation = useMutation(getUserRole, {
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },
  // });

  // if (status === 'edit') {
  //   mutation.mutate({ ownerID: initData.id, type: 1 });
  // }

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
    const { userName, phone, email, way, depIDs, roleIDs } = values;
    if (status === 'add') {
      const params: FormValues = {
        userName,
        phone,
        email,
        sendPhoneMsg: way && way.includes('phone') ? 1 : -1,
        sendEmailMsg: way && way.includes('email') ? 1 : -1,
        depIDs: depIDs ? [depIDs] : [],
        roleIDs: roleIDs ? [roleIDs] : [],
      };
      okModal(params);
    } else {
      const {
        userName,
        phone,
        email,
        depIDs,
        roleIDs,
      }: {
        userName: string;
        phone: string;
        email: string;
        depIDs: string;
        roleIDs: string;
      } = values;
      const params: EditFormValues = {
        userName,
        phone,
        email,
        delete: [],
        add: [],
        depIDs: depIDs ? [depIDs] : [],
      };
      if (initData.roleId !== values.roleIDs) {
        params.add = [roleIDs];
        params.delete = initData.deleteId ? [initData.deleteId] : [];
      }
      okModal(params);
    }
  };

  return (
    <Modal
      title={`${titleText}员工`}
      visible={visible}
      onCancel={closeModal}
      className="static-modal"
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
      <Form layout="vertical" ref={(n:any) => setForm(n)}>
        <TextField
          name="userName"
          label="员工姓名"
          defaultValue={initData.userName || ''}
          placeholder="请输入员工姓名"
          validateOnBlur
          schemas={[
            {
              rule: { required: true },
              help: '请输入员工姓名 ',
            },
          ]}
        />
        <TextField
          name="phone"
          label="手机号码"
          defaultValue={initData.phone || ''}
          placeholder="请输入手机号码"
          validateOnChange
          help="企业成员的真实手机号（手机号/邮箱，两者中至少必填一项）。"
          schemas={[
            {
              rule: { required: true },
              help: '请输入手机号码',
            },
            {
              rule: (value: string) => {
                let bol = true;
                const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
                if (!reg.test(value)) {
                  bol = false;
                }
                return bol;
              },
              help: '请输入合法的手机号',
            },
          ]}
        />
        <TextField
          name="email"
          label="邮箱"
          defaultValue={initData.email || ''}
          placeholder="例如：name@company.com"
          help="企业成员的真实邮箱，设置后可以通过邮箱接收到全象云平台发送的各类消息提醒（手机号/邮箱，两者中至少必填一项）。"
          validateOnChange
          schemas={[
            {
              rule: { required: true },
              help: '请输入邮箱帐号',
              status: 'error',
            },
            {
              rule: { isEmail: true, maxLength: 20 },
              help: '请输入合法的邮箱地址',
              status: 'error',
            },
          ]}
        />
        {
          status === 'add' && (
            <CheckboxGroupField
              name="way"
              label="向员工发送密码"
              options={[
                {
                  label: '通过邮箱',
                  value: 'email',
                },
                {
                  label: '通过短信',
                  value: 'phone',
                },
              ]}
            />
          )
        }
        <SelectTreeField
          name="depIDs"
          label="部门"
          placeholder="请选择部门"
          defaultSelect={initData.dep || ''}
          treeData={treeData}
          validateOnChange
          schemas={[
            {
              rule: { required: true },
              help: '请选择部门',
              status: 'error',
            },
          ]}
        />
        <SelectField
          name="roleIDs"
          label="角色"
          placeholder="请选择角色"
          defaultValue={initData.roleId || ''}
          validateOnChange
          options={
            roleList &&
            roleList.map((role) => ({
              label: role.name,
              value: role.id,
            }))
          }
          schemas={[
            {
              rule: { required: true },
              help: '请选择角色',
              status: 'error',
            },
          ]}
        />
      </Form>
    </Modal>
  );
};
