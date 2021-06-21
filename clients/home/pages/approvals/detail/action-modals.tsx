import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { TextArea } from '@QCFE/lego-ui';
import { Radio } from 'antd';
import { toJS } from 'mobx';
import toast from '@lib/toast';
import Modal from '@c/modal';
import Button from '@c/button';
import Icon from '@c/icon';
import ReceiverPicker from '@c/employee-or-department-picker';
import ReceiverList from '@c/employee-receiver-list';
import SelectStepBackNode from './select-step-back-node';

import store from './store';
import * as apis from '../api';
import { TaskHandleType } from '../constant';
import actionMap from './action-map';

interface Props {
  className?: string;
}

function ActionModals({ className }: Props) {
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const history = useHistory();
  const [showReceiverPicker, setShowPicker] = useState(false);
  const [chosenEmployees, setChosenEmployees] = useState([]);
  const [stepBackId, setStepBackId] = useState('');
  const { action, modalInfo } = store;
  const [addSignType, setAddSignType] = useState('');
  const [addSignValue, setAddSignValue] = useState('');

  const handleTaskMutation = useMutation((params: Record<string, any>) => {
    if ([TaskHandleType.agree, TaskHandleType.refuse, TaskHandleType.fill_in].includes(action as TaskHandleType)) {
      return apis.reviewTask(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        formData: store.taskItem || {},
      });
    }

    // 撤回
    if (action === TaskHandleType.cancel) {
      return apis.cancelTask(processInstanceID);
    }

    // 转交
    if (action === TaskHandleType.deliver) {
      if (!chosenEmployees.length) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.deliverTask(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        handleUserIds: chosenEmployees.map((v: { id: string }) => v.id),
      });
    }

    // 退回某步
    if (action === TaskHandleType.step_back) {
      if (!stepBackId) {
        toast.error('请选择回退的节点');
        return Promise.reject(new Error());
      }
      return apis.stepBack(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        // todo
        // step_back_id: stepBackId,
      });
    }

    if (action === TaskHandleType.send_back) {
      const { remark } = modalInfo.payload;
      if (!remark) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.sendBack(processInstanceID, taskID, {
        handleType: action,
        remark,
      });
    }

    // 抄送
    if (action === TaskHandleType.cc) {
      if (!chosenEmployees.length) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.ccFLow(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        handleUserIds: chosenEmployees.map((v: { id: string }) => v.id),
      });
    }

    // 处理抄送/ 标为已读
    if (action === TaskHandleType.hasCcHandleBtn) {
      return apis.readAll([processInstanceID]);
    }

    // 加签
    if (action === TaskHandleType.add_sign) {
      return apis.signTask(taskID, {
        assignee: chosenEmployees,
        type: addSignType,
      });
    }

    // 邀请阅示
    if (action === TaskHandleType.read) {
      if (!chosenEmployees.length) {
        store.setShowTips(true);
        return Promise.reject(new Error());
      }
      return apis.readFlow(processInstanceID, taskID, {
        handleType: action,
        remark: modalInfo.payload.remark || '',
        handleUserIds: chosenEmployees.map((v: { id: string }) => v.id),
      });
    }

    // 处理阅示
    if (action === TaskHandleType.hasReadHandleBtn) {
      return apis.handleRead(processInstanceID, taskID, {});
    }

    // if (action === TaskHandleType.hasResubmitBtn) {
    //
    // }

    // // 催办
    // if (action === TaskHandleType.hasUrgeBtn) {

    // }

    return Promise.reject(new Error(`未知操作: ${action}`));
  }, {
    onSuccess: (data) => {
      toast.success('操作成功');
      store.reset();
      setChosenEmployees([]);
      history.push('/approvals?list=todo');
    },
    onError: (err: Error) => {
      if (!err) {
        return;
      }
      toast.error(err.message || '操作失败');
    },
  });

  const renderContent = () => {
    const { payload } = store.modalInfo;
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

    // 转交
    if (action === TaskHandleType.deliver) {
      return (
        <div>
          <div className="mb-24">
            <Button iconName="add" onClick={() => setShowPicker(true)}>添加转交人</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">请选择转交人</p>}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter((item: { id: string }) => item.id != id));
            }} />
          <TextArea
            rows={4}
            name="comment"
            placeholder={`输入${actionMap[action]?.text}原因 (选填)`}
            onChange={(ev: unknown, value: string) => store.setModalInfo({ payload: { remark: value } })}
          />
        </div>
      );
    }

    if (action === TaskHandleType.step_back) {
      return (
        <div>
          <p className="text-yellow-600 flex items-center mb-24">
            <Icon name="info" className="text-yellow-600 mr-8" />
            将工作流任务回退至已流转过的节点（除开始节点），不中断任务
          </p>
          <SelectStepBackNode onChange={setStepBackId} />
          <div style={{ width: '500px' }}>
            <TextArea
              rows={4}
              name="comment"
              placeholder={`输入${actionMap[action]?.text}原因 (选填)`}
              onChange={(ev: unknown, value: string) => {
                store.setModalInfo({ payload: { remark: value } });
              }}
            />
          </div>
        </div>
      );
    }

    // 打回重填
    if (action === TaskHandleType.send_back) {
      return (
        <div>
          <p className="text-yellow-600 flex items-center mb-24">
            <Icon name="info" className="text-yellow-600 mr-8" />
            将工作流任务打回至初始节点，发起人重新填写后继续流转，不中断任务
          </p>
          <div>
            <TextArea
              rows={4}
              name="comment"
              placeholder={`输入${actionMap[action]?.text}原因`}
              onChange={(ev: unknown, value: string) => {
                store.setShowTips(!!value);
                store.setModalInfo({ payload: { remark: value } });
              }}
            />
            {store.showTips && !payload.remark && <p className="text-red-600">请输入打回重填原因</p>}
          </div>
        </div>
      );
    }

    // 抄送
    if (action === TaskHandleType.cc) {
      return (
        <div>
          <div className="mb-24">
            <Button iconName="add" onClick={() => setShowPicker(true)}>添加抄送人</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">请选择抄送人</p>}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter((item: { id: string }) => item.id != id));
            }} />
          <TextArea
            rows={4}
            name="comment"
            placeholder={`输入${actionMap[action]?.text}原因 (选填)`}
            onChange={(ev: unknown, value: string) => store.setModalInfo({ payload: { remark: value } })}
          />
        </div>
      );
    }

    // 处理抄送/ 标为已读
    if (action === TaskHandleType.hasCcHandleBtn) {
      return (
        <p>确定将该流程标为已读吗?</p>
      );
    }

    // 加签: todo: moved to v0.5
    if (action === TaskHandleType.add_sign) {
      return (
        <div>
          <div className="mb-24">
            <Button className={'mb-12'} iconName="add" onClick={() => setShowPicker(true)}>添加加签人</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">请选择加签人</p>}
            {<Radio.Group className={'block'} onChange={(e)=>{
              setAddSignType(e.target.value);
            }
            }>
              <Radio value={'BEFORE'}>此节点前加签</Radio>
              <Radio value={'AFTER'}>此节点后加签</Radio>
            </Radio.Group>}
            {chosenEmployees.length > 1 && (<Radio.Group onChange={(e)=>{
              setAddSignValue(e.target.value);
            }}>
              <Radio value={1}>会签</Radio>
              <Radio value={2}>或签</Radio>
            </Radio.Group>)}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter((item: { id: string }) => item.id != id));
            }} />
        </div>
      );
    }

    // 邀请阅示
    if (action === TaskHandleType.read) {
      return (
        <div>
          <div className="mb-24">
            <Button iconName="add" onClick={() => setShowPicker(true)}>添加阅示人</Button>
            {store.showTips && !chosenEmployees.length && <p className="text-red-600">请选择阅示人</p>}
          </div>
          <ReceiverList
            className="mb-24"
            receivers={chosenEmployees}
            onRemove={(id) => {
              setChosenEmployees((current) => current.filter((item: { id: string }) => item.id != id));
            }} />
          <TextArea
            rows={4}
            name="comment"
            placeholder={`输入${actionMap[action]?.text}原因 (选填)`}
            onChange={(ev: unknown, value: string) => store.setModalInfo({ payload: { remark: value } })}
          />
        </div>
      );
    }

    // 处理阅示
    if (action === TaskHandleType.hasReadHandleBtn) {
      return (
        <div>
          <TextArea
            rows={4}
            name="comment"
            placeholder={`输入${actionMap[action]?.text}原因 (选填)`}
            onChange={(ev: unknown, value: string) => store.setModalInfo({ payload: { remark: value } })}
          />
        </div>
      );
    }

    // // 重新提交
    // if (action === TaskHandleType.hasResubmitBtn) {

    // }

    // // 催办
    // if (action === TaskHandleType.hasUrgeBtn) {

    // }
  };

  if (!store.modalOpen) {
    return null;
  }

  return (
    <>
      <Modal
        title={`${store.modalInfo.title} ${store.taskItem.taskName || ''}`}
        footerBtns={[
          {
            key: 'close',
            text: '取消',
            onClick: () => {
              store.openModal(false);
              store.reset();
              setStepBackId('');
            },
          },
          {
            key: 'sure',
            modifier: 'primary',
            text: `确定${store.modalInfo.title}`,
            onClick: () => handleTaskMutation.mutate({}),
          },
        ]}
        onClose={() => {
          store.openModal(false);
          store.reset();
          setStepBackId('');
        }}
      >
        {renderContent()}
      </Modal>

      {showReceiverPicker && (
        <ReceiverPicker
          onlyEmployees
          onSubmit={(departments, employees) => {
            const receivers = employees.map((v) => toJS(v));
            setShowPicker(false);
            // @ts-ignore
            setChosenEmployees(receivers);
            return Promise.resolve(true);
          }}
          onCancel={() => setShowPicker(false)}
          title="选择抄送人"
          submitText="确定选择"
          employees={chosenEmployees}
          departments={[]}
        />
      )}
    </>

  );
}

export default observer(ActionModals);
