import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Modal, Form, Icon, Message } from '@QCFE/lego-ui';

import TreePicker from '@portal/components/tree-picker';
import { Button } from '@portal/components/button';
import { Loading } from '@portal/components/loading2';
import { UserInfo } from '@portal/api/auth';
import { getERPTree, addDepUser, updateUser } from '@net/corporate-directory';
import { departmentToTreeNode } from '@lib/utils';

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
  user: UserInfo;
  closeModal(): void;
}

export default function StaffModal(
  { user, closeModal }: Props,
) {
  const [form, setForm] = useState<any>(null);
  const titleText = `${user.id ? '修改' : '添加'}`;
  const queryClient = useQueryClient();
  const { data: departmentTree, isLoading } = useQuery('GET_ERP_TREE', getERPTree, {
    refetchOnWindowFocus: false,
  });

  const staffMutation = useMutation(user.id ? updateUser : addDepUser, {
    onSuccess: (data) => {
      if (data && data.code === 0) {
        Message.success('操作成功');
        closeModal();
        queryClient.invalidateQueries('GET_USER_ADMIN_INFO');
      } else {
        Message.error(data?.msg || '操作失败');
        closeModal();
      }
    },
  }
  );

  const handleSubmit = () => {
    const isValidate = form.validateForm();
    if (!isValidate) {
      return;
    }
    const values = form.getFieldsValue();

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
  };

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
        <div className="flex items-center">
          <Button
            icon={<Icon name="close" className="mr-4" />}
            className="mr-20"
            onClick={closeModal}>
            取消
          </Button>
          <Button
            className="bg-black-900"
            textClassName="text-white"
            icon={<Icon name="check" type="light" className="mr-4" />}
            onClick={handleSubmit}
          >
            确定{titleText}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={(form: any) => setForm(form)}>
        <TextField
          validateOnBlur
          name="userName"
          label="员工姓名"
          defaultValue={user.userName}
          placeholder="请输入员工姓名"
          schemas={[
            {
              rule: { required: true },
              help: '请输入员工姓名 ',
            },
          ]}
        />
        <TextField
          validateOnChange
          name="phone"
          label="手机号码"
          defaultValue={user.phone}
          placeholder="请输入手机号码"
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
        {
          showDepTree && (
            <TreePicker
              label="部门"
              treeData={departmentToTreeNode(departmentTree as IDepartment)}
              labelKey="departmentName"
              name="depID"
              defaultValue={user?.dep?.id}
            />
          )
        }
      </Form>
    </Modal>
  );
}
