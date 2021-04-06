import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Modal, Message } from '@QCFE/lego-ui';

import SvgIcon from '@c/icon';
import Button from '@c/button';
import { setDEPLeader, cancelDEPLeader, LeaderParams } from '@lib/requests/corporate-directory';

import { LeaderStatus } from '../type';

interface Props {
  user: UserInfo;
  closeModal(): void;
}

export default function LeaderHandleModal({ user, closeModal }: Props) {
  const isLeader = user.isDEPLeader === LeaderStatus.true;
  const title = isLeader ? '取消' : '设为';
  const isHave = isLeader ? '没有' : '拥有';
  const api = isLeader ? cancelDEPLeader : setDEPLeader;
  const queryClient = useQueryClient();

  const mutation = useMutation(api, {
    onSuccess: (res) => {
      if (res && res.code === 0) {
        Message.success('操作成功');
        closeModal();
        queryClient.invalidateQueries('GET_USER_ADMIN_INFO');
      } else {
        Message.error('操作失败');
        closeModal();
      }
    },
  });

  function handleSubmit() {
    const params: LeaderParams = { depID: '' };
    params.depID = user.dep ? user.dep.id : '';
    if (!isLeader) {
      params.userID = user.id;
    }
    mutation.mutate(params);
  }

  return (
    <Modal
      visible
      title={`${title}主管`}
      className='static-modal'
      footer={
        (<div className="flex items-center">
          <Button
            icon={<SvgIcon name="close" size={20} className="mr-8" />}
            onClick={closeModal}
            className="mr-20"
          >
            取消
          </Button>
          <Button
            className="bg-black-900"
            textClassName="text-white"
            icon={<SvgIcon name="check" type="light" size={20} className="mr-8" />}
            onClick={handleSubmit}
          >
            确定{title}主管
          </Button>
        </div>)
      }
    >
      <div>
        <div className='flex items-center'>
          <SvgIcon name="info" size={20} style={{ color: '#D97706' }} className='mr-8' />
          <div className="text-yellow-600 text-14">
            确定将员工<span className='mx-4'>{user.userName}</span>{title}主管吗？
          </div>
        </div>
        <div className='ml-28 mt-8 text-14'>
          {title}主管后，用户将{isHave}主管的流程审批权限以及管理权限。
        </div>
      </div>
    </Modal>
  );
}
