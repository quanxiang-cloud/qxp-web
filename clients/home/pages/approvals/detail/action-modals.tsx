import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { TextArea } from '@QCFE/lego-ui';
import toast from '@lib/toast';
import Modal from '@c/modal';
import Button from '@c/button';
import ReceiverPicker from '@c/employee-or-department-picker';

import store from './store';
import * as apis from '../api';
import { TaskHandleType } from '../constant';
import actionMap from './action-map';

interface Props {
  className?: string;
  flowName?: string;
}

function ActionModals({ flowName }: Props) {
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const history = useHistory();
  const [showReceiverPicker, setShowPicker] = useState(false);
  const { action, modalInfo } = store;

  const handleTaskMutation = useMutation((params: Record<string, any>) => {
    if ([TaskHandleType.agree, TaskHandleType.refuse, TaskHandleType.fill_in].includes(action as TaskHandleType)) {
      return apis.reviewTask(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
      });
    }

    // 撤回
    if (action === TaskHandleType.hasCancelBtn) {
      // todo: api missing
    }

    if (action === TaskHandleType.deliver) {

    }

    if (action === TaskHandleType.step_back) {

    }

    if (action === TaskHandleType.send_back) {

    }

    // 抄送
    if (action === TaskHandleType.cc) {
      return apis.ccFLow(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        handleUserIds: [],
      });
    }

    // 处理抄送/ 标为已读
    if (action === TaskHandleType.hasCcHandleBtn) {

    }

    if (action === TaskHandleType.add_sign) {

    }

    // 邀请阅示
    if (action === TaskHandleType.read) {

    }

    // 处理阅示
    if (action === TaskHandleType.hasReadHandleBtn) {

    }

    if (action === TaskHandleType.hasResubmitBtn) {

    }

    // 催办
    if (action === TaskHandleType.hasUrgeBtn) {

    }

    return Promise.reject(`未知操作: ${action}`);
  }, {
    onSuccess: (data) => {
      toast.success('操作成功');
      store.openModal(false);
      history.push('/approvals?list=done');
    },
    onError: (err: Error) => {
      toast.error(err.message || '操作失败');
    },
  });

  const renderContent = () => {
    if ([TaskHandleType.agree, TaskHandleType.refuse, TaskHandleType.fill_in].includes(action as TaskHandleType)) {
      return (
        <TextArea
          rows={4}
          name="comment"
          placeholder={`输入${actionMap[action]?.text}意见 (选填)`}
          onChange={(ev: unknown, value: string) => store.setModalInfo({ payload: { remark: value } })}
        />
      );
    }

    // 撤回
    if (action === TaskHandleType.hasCancelBtn) {
      return (
        <p>确定要撤销该任务吗？撤销后，任务将立即结束。</p>
      );
    }

    if (action === TaskHandleType.deliver) {

    }

    if (action === TaskHandleType.step_back) {

    }

    if (action === TaskHandleType.send_back) {

    }

    // 抄送
    if (action === TaskHandleType.cc) {
      return (
        <div>
          <Button iconName="add" className="mb-28" onClick={() => setShowPicker(true)}>添加抄送人</Button>
          <TextArea
            rows={4}
            name="comment"
            placeholder={`输入${actionMap[action]?.text}意见 (选填)`}
            onChange={(ev: unknown, value: string) => store.setModalInfo({ payload: { remark: value } })}
          />
        </div>
      );
    }

    // 处理抄送/ 标为已读
    if (action === TaskHandleType.hasCcHandleBtn) {

    }

    if (action === TaskHandleType.add_sign) {

    }

    // 邀请阅示
    if (action === TaskHandleType.read) {

    }

    // 处理阅示
    if (action === TaskHandleType.hasReadHandleBtn) {

    }

    if (action === TaskHandleType.hasResubmitBtn) {

    }

    // 催办
    if (action === TaskHandleType.hasUrgeBtn) {

    }
  };

  if (!store.modalOpen) {
    return null;
  }

  return (
    <>
      <Modal
        title={`${store.modalInfo.title} ${flowName || ''}`}
        okText={`确定${store.modalInfo.title}`}
        onClose={() => store.openModal(false)}
        onConfirm={() => {
          handleTaskMutation.mutate({});
        }}
      >
        {renderContent()}
      </Modal>

      {showReceiverPicker && (
        <ReceiverPicker
          onSubmit={() => Promise.resolve(true)}
          onCancel={() => setShowPicker(false)}
          title="选择员工或部门"
          submitText="确定选择"
          departments={[]}
          employees={[]}
        />
      )}
    </>

  );
}

export default observer(ActionModals);
