import React, { createRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Modal, Form } from '@QCFE/lego-ui';

import TreePicker from '@c/form/input/tree-picker-field';
import Button from '@c/button';
import Loading from '@c/loading';
import { departmentToTreeNode } from '@lib/utils';
import notify from '@lib/notify';

import { SpecialSymbolsReg, PhoneReg } from '../utils';
import { getERPTree, addDepUser, updateUser } from '../api';

const { TextField, CheckboxGroupField } = Form;

const EMAIL_HELP = '企业成员的真实邮箱，设置后可以通过邮箱接收到全象云平台发送的各类消息提醒（手机号/邮箱，两者中至少必填一项）。';

export type FormValues = {
  userName: string;
  phone: string;
  email: string;
  depIDs: string[];
  roleIDs?: string[];
  delete?: string[];
  add?: string[];
  id?: string;
  sendEmailMsg?: 1 | -1;
  sendPhoneMsg?: 1 | -1;
};

interface Props {
  user: Employee;
  closeModal(): void;
}

export default function EditEmployeesModal(
  { user, closeModal }: Props,
) {
  const formRef = createRef<Form>();
  const titleText = `${user.id ? '修改' : '添加'}`;
  const queryClient = useQueryClient();
  const { data: departmentTree, isLoading } = useQuery('GET_ERP_TREE', getERPTree, {
    refetchOnWindowFocus: false,
  });

  const staffMutation = useMutation(user.id ? updateUser : addDepUser, {
    onSuccess: (data) => {
      if (data && data.code === 0) {
        notify.success('操作成功');
        closeModal();
        queryClient.invalidateQueries('GET_USER_ADMIN_INFO');
      } else {
        notify.error(data?.msg || '操作失败');
        closeModal();
      }
    },
  });

  function handleSubmit() {
    const isValidate = formRef.current?.validateForm();
    if (!isValidate) {
      return;
    }
    const values = formRef.current?.getFieldsValue();

    const { userName, phone, email, sendPasswordBy, depID } = values;
    const roleIDs = '3';
    if (!user.id) {
      const params: FormValues = {
        userName,
        phone,
        email,
        sendPhoneMsg: sendPasswordBy && sendPasswordBy.includes('phone') ? 1 : -1,
        sendEmailMsg: sendPasswordBy && sendPasswordBy.includes('email') ? 1 : -1,
        depIDs: depID ? [depID] : [],
        roleIDs: roleIDs ? [roleIDs] : [],
      };
      staffMutation.mutate(params);
    } else {
      const params: FormValues = {
        id: user.id,
        userName,
        phone,
        email,
        delete: [],
        add: [],
        depIDs: depID ? [depID] : [],
      };
      if (user.roleId !== values.roleIDs) {
        params.add = [roleIDs];
        params.delete = user.deleteId ? [user.deleteId] : [];
      }
      staffMutation.mutate(params);
    }
  }

  const showDepTree = !user.id || (user.id && user.isDEPLeader !== -1);

  if (isLoading && !departmentTree) {
    return <Loading desc="加载中..." />;
  }

  return (
    <Modal
      title={`${titleText}员工`}
      visible
      onCancel={closeModal}
      className="static-modal"
      footer={
        (<div className="flex items-center">
          <Button
            iconName="close"
            className="mr-20"
            onClick={closeModal}>
            取消
          </Button>
          <Button
            modifier="primary"
            iconName="check"
            onClick={handleSubmit}
          >
            确定{titleText}
          </Button>
        </div>)
      }
    >
      <Form layout="vertical" ref={formRef}>
        <TextField
          // @ts-ignore
          validateOnBlur
          name="userName"
          label="员工姓名"
          defaultValue={user.userName}
          placeholder="请输入员工姓名"
          maxLength={30}
          schemas={[
            {
              rule: { required: true },
              help: '请输入员工姓名 ',
            },
            {
              rule: (value: string) => {
                let isPass = true;
                if (SpecialSymbolsReg.test(value)) {
                  isPass = false;
                }
                return isPass;
              },
              help: '只能包含汉字、英文、横线("-")以及下划线("_")，请修改！',
            },
          ]}
        />
        <TextField
          validateOnChange
          name="phone"
          label="手机号码"
          defaultValue={user.phone}
          placeholder="请输入手机号码"
          help="企业成员的真实手机号"
          schemas={[
            {
              rule: { required: true },
              help: '请输入手机号码',
            },
            {
              rule: (value: string) => {
                let isPass = true;
                if (!PhoneReg.test(value)) {
                  isPass = false;
                }
                return isPass;
              },
              help: '请输入合法的手机号',
            },
          ]}
        />
        <TextField
          validateOnChange
          name="email"
          label="邮箱"
          defaultValue={user.email}
          placeholder="例如：name@company.com"
          help={EMAIL_HELP}
          schemas={[
            {
              rule: { required: true },
              help: '请输入邮箱帐号',
              status: 'error',
            },
            {
              rule: { isEmail: true },
              help: '请输入合法的邮箱地址',
              status: 'error',
            },
          ]}
        />
        {
          !user.id && (
            <CheckboxGroupField
              name="sendPasswordBy"
              label="选择密码的发送方式"
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
        {
          showDepTree && (
            <TreePicker
              label="部门"
              treeData={departmentToTreeNode(departmentTree as Department)}
              labelKey="departmentName"
              name="depID"
              defaultValue={user?.dep?.id}
              required
              help="请选择部门"
            />
          )
        }
      </Form>
    </Modal>
  );
}
