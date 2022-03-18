import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Form, Input } from 'antd';

import TreePicker from '@c/form/input/tree-picker-field';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';
import { departmentToTreeNode } from '@lib/utils';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import { getTwoDimenArrayHead } from '@lib/utils';

import DirectSuperior from './direct-superior';
import { SpecialSymbolsReg, PhoneReg } from '../utils';
import { getERPTree, addDepUser, updateUser } from '../api';
import { sendMsgOption } from './reset-password-modal';

const EMAIL_HELP = '企业成员的真实邮箱，设置后可以通过邮箱接收到全象云平台发送的各类消息提醒（手机号/邮箱，两者中至少必填一项）。';

type Dep = {
  depID: string;
  attr: string
}

type Leader = {
  userID: string;
  attr: string;
}

type SendMessage = {
  sendChannel: number;
  sendTo: string;
}

export type FormValues = {
  position: string;
  leader?: Leader[];
  name: string;
  phone: string;
  email: string;
  selfEmail?: string;
  dep: Dep[];
  id?: string;
  useStatus?: 1 | 2;
  sendMessage?: SendMessage;
};

interface Props {
  user: Employee;
  closeModal(): void;
}

export const SEND_MAP: Record<any, 'email' | 'phone'> = {
  1: 'email',
  2: 'phone',
};

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
    const { name, phone, email, selfEmail, sendPasswordBy, depID, leader, position } = values;
    if (!user.id) {
      const sendMessage = {
        sendChannel: sendPasswordBy || 0,
        sendTo: values[SEND_MAP[sendPasswordBy]] || '',
      };
      const params: FormValues = {
        position,
        name,
        phone,
        email,
        selfEmail,
        useStatus: 1,
        sendMessage,
        dep: depID ? [{
          depID: depID,
          attr: '',
        }] : [],
      };
      if (leader.id) {
        params.leader = [{ userID: leader.id, attr: '' }];
      }
      staffMutation.mutate(params);
    } else {
      const params: FormValues = {
        position,
        id: user.id,
        name,
        phone,
        email,
        dep: depID ? [{
          depID: depID,
          attr: '',
        }] : [],
      };
      if (leader.id) {
        params.leader = [{ userID: leader.id, attr: '' }];
      }
      staffMutation.mutate(params);
    }
  }

  const dep = getTwoDimenArrayHead(user.departments);
  const isLeader = dep?.attr === '1';
  const showDepTree = !user.id || (user.id && !isLeader);

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
          name: user.name,
          phone: user.phone,
          email: user.email,
          leader: {
            id: getTwoDimenArrayHead(user.leaders)?.id,
            name: getTwoDimenArrayHead(user.leaders)?.name,
          },
          position: user.position,
        }}
      >
        <Form.Item
          name="name"
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
        <Form.Item
          name="selfEmail"
          label="私人邮箱"
          rules={[
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
              <RadioGroup onChange={(value) => value}>
                {sendMsgOption.map((option) => {
                  return (
                    <Radio
                      className="mr-8"
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  );
                })}
              </RadioGroup>
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
              labelKey="name"
            />
          </Form.Item>
        )}
        <Form.Item
          name="leader"
          label="直属上级"
        >
          <DirectSuperior />
        </Form.Item>
        <Form.Item
          name="position"
          label="职位"
        >
          <Input placeholder='请输入职位名称' />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditEmployeesModal;
