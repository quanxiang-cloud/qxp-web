import React, { useState, createRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Form } from '@QCFE/lego-ui';

import TreePicker from '@c/form/input/tree-picker-field';
import Loading from '@c/loading';
import Modal from '@c/modal';
import Button from '@c/button';
import { departmentToTreeNode } from '@lib/utils';
import toast from '@lib/toast';

import { SpecialSymbolsReg, PhoneReg } from '../utils';
import { getERPTree, addDepUser, updateUser } from '../api';
import DirectLeaderChoose from './direct-leader-modal';

const { TextField, CheckboxGroupField } = Form;

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

export default function EditEmployeesModal(
  { user, closeModal }: Props,
) {
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [leader, setLeader] = useState<Leader>({
    id: user.leaderID ?? '',
    userName: user.leaderName ?? '',
  });
  const formRef = createRef<Form>();
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

  async function onAssociate(
    leader: Leader,
  ) {
    setLeader(leader);
    setShowLeaderModal(false);
  }

  function handleSubmit() {
    const isValidate = formRef.current?.validateForm();
    if (!isValidate) {
      return;
    }
    const values = formRef.current?.getFieldsValue();

    const { position, userName, phone, email, sendPasswordBy, depID } = values;
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
    <>
      {showLeaderModal && !isLoading && (
        <DirectLeaderChoose
          title="关联直属上级"
          submitText="确定关联"
          onSubmit={onAssociate}
          onCancel={() => setShowLeaderModal(false)}
          current={leader}
        />
      )}
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
            disabled={user.id ? true : false}
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
            disabled={user.id ? true : false}
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
          <div className="label text-gray-600">直属上级</div>
          <div className="flex items-center leaderName mb-24">
            <TextField
              className="flex-1 grid"
              validateOnChange
              name="leaderName "
              value={leader.userName}
              placeholder="直属上级姓名"
            />
            <Button
              modifier="primary"
              className="ml-32"
              iconName="link"
              onClick={() => setShowLeaderModal(true)}
            >
              关联直属上级
            </Button>
          </div>
          <TextField
            validateOnChange
            name="position"
            label="职位"
            defaultValue={user.position}
            placeholder="请输入职位名称"
            schemas={[
              {
                rule: { required: true },
                help: '请输入职位名称',
              },
            ]}
          />
        </Form>
      </Modal>
    </>
  );
}
