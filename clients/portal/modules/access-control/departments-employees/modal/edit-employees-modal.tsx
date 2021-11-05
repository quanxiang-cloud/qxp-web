import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Form, Input } from 'antd';

import TreePicker from '@c/form/input/tree-picker-field';
import CheckboxGroup from '@c/checkbox/checkbox-group';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';
import { departmentToTreeNode } from '@lib/utils';

import DirectSuperior from './direct-superior';
import { SpecialSymbolsReg, PhoneReg } from '../utils';
import { getERPTree, addDepUser, updateUser } from '../api';

const EMAIL_HELP = '企业成员的真实邮箱，设置后可以通过邮箱接收到全象云平台发送的各类消息提醒（手机号/邮箱，两者中至少必填一项）。';

export type FormValues = {
  position: string;
  leaderID: string;
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

function EditEmployeesModal( { user, closeModal }: Props): JSX.Element {
  const [form] = Form.useForm();
  const titleText = `${user.id ? '修改' : '添加'}`;
  const queryClient = useQueryClient();

  const { data: departmentTree, isLoading } = useQuery('GET_ERP_TREE', getERPTree, {
    refetchOnWindowFocus: false,
  });

  const staffMutation = useMutation(user.id ? updateUser : addDepUser, {
    onSuccess: () => {
      toast.success('操作成功');
      closeModal();
      queryClient.invalidateQueries('GET_USER_ADMIN_INFO');
    },
    onError: (error: string) => {
      toast.error(error);
    },
  },
  );

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: any): void {
    const { userName, phone, email, sendPasswordBy, depID, leader, position } = values;
    if (!user.id) {
      const params: FormValues = {
        position,
        leaderID: leader.id,
        userName,
        phone,
        email,
        sendPhoneMsg: sendPasswordBy && sendPasswordBy.includes('phone') ? 1 : -1,
        sendEmailMsg: sendPasswordBy && sendPasswordBy.includes('email') ? 1 : -1,
        depIDs: depID ? [depID] : [],
      };
      staffMutation.mutate(params);
    } else {
      const params: FormValues = {
        position,
        leaderID: leader.id,
        id: user.id,
        userName,
        phone,
        email,
        delete: [],
        depIDs: depID ? [depID] : [],
      };
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
      onClose={closeModal}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: '确定' + titleText,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <Form
        layout="vertical"
        className="p-20"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          userName: user.userName,
          phone: user.phone,
          email: user.email,
          leader: {
            id: user.leaderID,
            userName: user.leaderName,
          },
          position: user.position,
        }}
      >
        <Form.Item
          name="userName"
          label="员工姓名"
          rules={[
            { required: true, message: '请输入员工姓名' },
            {
              validator: (_, value) => {
                if (value && SpecialSymbolsReg.test(value)) {
                  return Promise.reject(new Error('只能包含汉字、英文、横线("-")以及下划线("_")，请修改！'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder='请输入员工姓名' />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号码"
          extra="企业成员的真实手机号"
          rules={[
            { required: true, message: '请输入手机号码' },
            {
              validator: (_, value) => {
                if (value && !PhoneReg.test(value)) {
                  return Promise.reject(new Error('请输入合法的手机号'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input disabled={user.id ? true : false} placeholder="请输入手机号码" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          extra={EMAIL_HELP}
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入合法的邮箱地址' },
          ]}
        >
          <Input disabled={user.id ? true : false} placeholder="例如：name@company.com" />
        </Form.Item>
        {
          !user.id && (
            <Form.Item
              name="sendPasswordBy"
              label="选择密码的发送方式"
              rules={[
                { required: false, message: '请选择密码的发送方式' },
              ]}
            >
              <CheckboxGroup
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
            </Form.Item>
          )
        }
        { showDepTree && (
          <Form.Item
            name="depID"
            label="部门"
            rules={[
              { required: true, message: '请选择部门' },
            ]}
          >
            <TreePicker
              treeData={departmentToTreeNode(departmentTree as Department)}
              labelKey="departmentName"
            />
          </Form.Item>
        )}
        <Form.Item
          name="leader"
          label="直属上级"
          rules={[
            { required: true, message: '请选择直属上级' },
          ]}
        >
          <DirectSuperior />
        </Form.Item>
        <Form.Item
          name="position"
          label="职位"
          rules={[
            { required: true, message: '请输入职位名称' },
          ]}
        >
          <Input placeholder='请输入职位名称' />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditEmployeesModal;
